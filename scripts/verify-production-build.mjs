/**
 * Runs after a production build (SHOW_DEMO_CONTENT=false) and fails if demonstration content
 * reached the output (docs/adr/0004-demo-content-isolation.md):
 *
 * - no page may carry the demo label;
 * - no demo article, work or Duas Leituras entry may have been generated as a page;
 * - no output (pages, the search index inside /busca, the sitemap) may link to a demo
 *   article or Duas Leituras entry.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const BUILD_OUTPUT_DIRECTORY = '.next/server/app';
const DEMO_CONTENT_DIRECTORY = 'content/demo';
const DEMO_LABEL = 'Conteúdo de demonstração';
/** Pages (.html), their React Server Component payloads (.rsc) and route outputs such as the sitemap (.body). */
const TEXT_OUTPUT_EXTENSIONS = ['.html', '.rsc', '.body'];

async function listFiles(directory, extensions) {
  const entries = await readdir(directory, { withFileTypes: true, recursive: true });
  return entries
    .filter(
      (entry) => entry.isFile() && extensions.some((extension) => entry.name.endsWith(extension)),
    )
    .map((entry) => path.join(entry.parentPath, entry.name));
}

async function listSlugs(directory) {
  const filePaths = await listFiles(directory, ['.mdx', '.yaml']);
  return filePaths.map((filePath) => path.basename(filePath, path.extname(filePath)));
}

function escapeForPattern(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const demoSlugs = new Set(await listSlugs(DEMO_CONTENT_DIRECTORY));

// Article and Duas Leituras slugs are long and distinctive, so finding "/<slug>" in the
// output means a link to demo content. Work slugs ("labirinto") are short and could be a
// real tag, so they are only checked as generated page names.
const linkedDemoSlugs = [
  ...(await listSlugs(path.join(DEMO_CONTENT_DIRECTORY, 'articles'))),
  ...(await listSlugs(path.join(DEMO_CONTENT_DIRECTORY, 'two-perspectives'))),
];
const demoLinkPattern = new RegExp(
  `/(${linkedDemoSlugs.map(escapeForPattern).join('|')})(?![a-z0-9-])`,
);

const outputFiles = await listFiles(BUILD_OUTPUT_DIRECTORY, TEXT_OUTPUT_EXTENSIONS);
const generatedPages = outputFiles.filter((filePath) => filePath.endsWith('.html'));
const problems = [];

for (const filePath of outputFiles) {
  const contents = await readFile(filePath, 'utf8');

  if (filePath.endsWith('.html') && demoSlugs.has(path.basename(filePath, '.html'))) {
    problems.push(`demo page was generated: ${filePath}`);
  }
  if (contents.includes(DEMO_LABEL)) {
    problems.push(`output shows the demo label: ${filePath}`);
  }
  const demoLink = linkedDemoSlugs.length > 0 ? demoLinkPattern.exec(contents) : null;
  if (demoLink) {
    problems.push(`output links to demo content (${demoLink[0]}): ${filePath}`);
  }
}

if (generatedPages.length === 0) {
  problems.push(`no pages found in ${BUILD_OUTPUT_DIRECTORY}; run "pnpm build" first`);
}

if (problems.length > 0) {
  console.error('Demonstration content leaked into the production build:');
  problems.forEach((problem) => console.error(`  - ${problem}`));
  process.exit(1);
}

console.log(
  `Checked ${generatedPages.length} pages and ${outputFiles.length - generatedPages.length} ` +
    'other outputs: no demonstration content.',
);
