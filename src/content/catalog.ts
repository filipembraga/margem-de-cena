import { checkIntegrity } from './integrity';
import { ContentValidationError, type ContentIssue } from './issues';
import { parseContent, type ParsedContent } from './parse';
import { resolveCatalog, type ContentCatalog } from './resolve';
import type { ContentSource } from './source';

/**
 * Runs the whole pipeline (docs/adr/0002-file-based-content-layer.md):
 *
 * ```
 * ContentSource -> parse (schemas, MDX) -> integrity -> images -> resolve -> ContentCatalog
 * ```
 *
 * Throws a `ContentValidationError` listing every problem found, which fails the build.
 */
export async function buildCatalog(
  source: ContentSource,
  options: { includeDemo: boolean },
): Promise<ContentCatalog> {
  const raw = await source.load(options);
  const { content, issues: parseIssues } = await parseContent(raw);
  const integrityIssues = checkIntegrity(content);
  const imageIssues = await checkImages(content, source);

  const issues = [...parseIssues, ...integrityIssues, ...imageIssues];
  if (issues.length > 0) {
    throw new ContentValidationError(issues);
  }

  return resolveCatalog(content);
}

/** Every referenced image must exist under `public/`. Alt, credit and licence come from the schema. */
async function checkImages(content: ParsedContent, source: ContentSource): Promise<ContentIssue[]> {
  const imageReferences = [
    ...content.articles.map(({ record, data }) => ({ origin: record.origin, image: data.cover })),
    ...content.works.map(({ record, data }) => ({ origin: record.origin, image: data.cover })),
    ...content.authors.map(({ record, data }) => ({
      origin: record.origin,
      image: data.profileImage,
    })),
  ];

  const issues = await Promise.all(
    imageReferences.map(async ({ origin, image }): Promise<ContentIssue | null> => {
      if (!image || (await source.imageExists(image.src))) {
        return null;
      }
      return { origin, message: `Imagem não encontrada: public${image.src}.` };
    }),
  );

  return issues.filter((issue) => issue !== null);
}
