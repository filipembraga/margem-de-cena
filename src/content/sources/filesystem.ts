import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { parse as parseYaml } from 'yaml';

import type { ContentSource, RawContent, RawRecord } from '../source';

/**
 * Reads content from the repository:
 *
 * ```
 * content/articles/*.mdx         content/demo/articles/*.mdx
 * content/authors/*.yaml
 * content/works/*.yaml           content/demo/works/*.yaml
 * content/two-perspectives/*.yaml content/demo/two-perspectives/*.yaml
 * content/pages/*.mdx
 * ```
 *
 * The file name is the slug. `content/demo/` is read only when demo content is requested,
 * so production builds never see it (docs/adr/0004-demo-content-isolation.md).
 */

type RecordFormat = 'mdx' | 'yaml';

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function createFilesystemSource(rootDirectory: string = process.cwd()): ContentSource {
  const contentDirectory = path.join(rootDirectory, 'content');
  const publicDirectory = path.join(rootDirectory, 'public');

  async function readCollection(
    relativeDirectory: string,
    format: RecordFormat,
    isDemo: boolean,
  ): Promise<RawRecord[]> {
    const directory = path.join(contentDirectory, relativeDirectory);
    const fileNames = await listFiles(directory, `.${format}`);

    return Promise.all(
      fileNames.map(async (fileName) => {
        const filePath = path.join(directory, fileName);
        const fileContents = await readFile(filePath, 'utf8');
        const origin = path.relative(rootDirectory, filePath);
        const slug = path.basename(fileName, `.${format}`);

        return format === 'mdx'
          ? parseMdxFile(fileContents, { slug, origin, isDemo })
          : { slug, origin, isDemo, body: '', ...parseYamlSafely(fileContents) };
      }),
    );
  }

  async function readCollectionWithDemo(
    collection: string,
    format: RecordFormat,
    includeDemo: boolean,
  ): Promise<RawRecord[]> {
    const records = await readCollection(collection, format, false);
    if (!includeDemo) {
      return records;
    }
    const demoRecords = await readCollection(path.join('demo', collection), format, true);
    return [...records, ...demoRecords];
  }

  return {
    async load({ includeDemo }): Promise<RawContent> {
      const [articles, authors, works, twoPerspectives, pages] = await Promise.all([
        readCollectionWithDemo('articles', 'mdx', includeDemo),
        readCollection('authors', 'yaml', false),
        readCollectionWithDemo('works', 'yaml', includeDemo),
        readCollectionWithDemo('two-perspectives', 'yaml', includeDemo),
        readCollection('pages', 'mdx', false),
      ]);
      return { articles, authors, works, twoPerspectives, pages };
    },

    async imageExists(src: string): Promise<boolean> {
      try {
        await access(path.join(publicDirectory, src));
        return true;
      } catch {
        // A missing file is the answer, not a failure: the integrity check reports it.
        return false;
      }
    },
  };
}

async function listFiles(directory: string, extension: string): Promise<string[]> {
  try {
    const fileNames = await readdir(directory);
    return fileNames.filter((fileName) => fileName.endsWith(extension)).sort();
  } catch (error) {
    // A collection without a folder is simply empty (e.g. no essays yet).
    if (isMissingDirectoryError(error)) {
      return [];
    }
    throw error;
  }
}

function isMissingDirectoryError(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

function parseMdxFile(
  fileContents: string,
  record: Pick<RawRecord, 'slug' | 'origin' | 'isDemo'>,
): RawRecord {
  const match = FRONTMATTER_PATTERN.exec(fileContents);

  if (!match) {
    return {
      ...record,
      data: {},
      body: fileContents,
      syntaxError: 'Frontmatter ausente: o arquivo deve começar com um bloco entre linhas "---".',
    };
  }

  return {
    ...record,
    body: fileContents.slice(match[0].length),
    ...parseYamlSafely(match[1] ?? ''),
  };
}

/**
 * Broken YAML is recorded instead of thrown, so it is reported together with every other
 * problem rather than stopping at the first broken file.
 */
function parseYamlSafely(text: string): Pick<RawRecord, 'data' | 'syntaxError'> {
  try {
    return { data: parseYaml(text) ?? {}, syntaxError: null };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { data: {}, syntaxError: `YAML inválido: ${reason}` };
  }
}
