import { checkIntegrity } from './integrity';
import { ContentValidationError, type ContentIssue } from './issues';
import { parseContent, toFileLine, type ParsedContent } from './parse';
import { findPublishedPlaceholders } from './placeholders';
import { resolveCatalog, type ContentCatalog, type ImageSizes } from './resolve';
import type { ContentSource, RawRecord } from './source';
import type { ImageSize } from './types';

export type CatalogOptions = {
  includeDemo: boolean;
  /**
   * Fails on "[A PREENCHER: …]" texts left in published content or author data. Set for the
   * production deployment only, where a placeholder must never go live.
   */
  rejectPlaceholders?: boolean;
};

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
  options: CatalogOptions,
): Promise<ContentCatalog> {
  const raw = await source.load({ includeDemo: options.includeDemo });
  const { content, issues: parseIssues } = await parseContent(raw);
  const integrityIssues = checkIntegrity(content);
  const { imageSizes, issues: imageIssues } = await measureImages(content, source);
  const placeholderIssues = options.rejectPlaceholders ? findPublishedPlaceholders(content) : [];

  const issues = [...parseIssues, ...integrityIssues, ...imageIssues, ...placeholderIssues];
  if (issues.length > 0) {
    throw new ContentValidationError(issues);
  }

  return resolveCatalog(content, imageSizes);
}

type ImageReference = {
  origin: string;
  src: string;
  /** Line of a `<Figure>` in the body; covers and profile images have none. */
  line: number | null;
};

/**
 * Every referenced image (covers, profile images and `<Figure>` images in bodies) must be a
 * readable image under `public/`. Their dimensions are kept so images render without layout
 * shift. Alt text, credit and licence are checked by the schemas and the MDX rules.
 */
async function measureImages(
  content: ParsedContent,
  source: ContentSource,
): Promise<{ imageSizes: ImageSizes; issues: ContentIssue[] }> {
  const references = listImageReferences(content);
  const uniqueSources = [...new Set(references.map((reference) => reference.src))];

  const measuredImages = await Promise.all(
    uniqueSources.map(async (src) => [src, await source.readImageSize(src)] as const),
  );

  const imageSizes = new Map<string, ImageSize>();
  for (const [src, size] of measuredImages) {
    if (size !== null) {
      imageSizes.set(src, size);
    }
  }

  const issues: ContentIssue[] = references
    .filter((reference) => !imageSizes.has(reference.src))
    .map(({ origin, src, line }) => ({
      origin,
      line,
      message: `Imagem não encontrada ou ilegível: public${src}.`,
    }));

  return { imageSizes, issues };
}

function bodyImageReferences(
  record: RawRecord,
  images: Array<{ src: string; line: number | null }>,
): ImageReference[] {
  return images.map((image) => ({
    origin: record.origin,
    src: image.src,
    line: toFileLine(image.line, record),
  }));
}

function listImageReferences(content: ParsedContent): ImageReference[] {
  const references: ImageReference[] = [];

  function addImage(origin: string, image: { src: string } | undefined): void {
    if (image) {
      references.push({ origin, src: image.src, line: null });
    }
  }

  for (const { record, data, body } of content.articles) {
    addImage(record.origin, data.cover);
    references.push(...bodyImageReferences(record, body.images));
  }
  for (const { record, body } of content.pages) {
    references.push(...bodyImageReferences(record, body.images));
  }
  for (const { record, data } of content.works) {
    addImage(record.origin, data.cover);
  }
  for (const { record, data } of content.authors) {
    addImage(record.origin, data.profileImage);
  }
  return references;
}
