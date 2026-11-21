import { getCategoryPath, type Category } from './categories';

/**
 * Paths of the category archives, filtered by tag and split into pages (brief §5.2):
 *
 * - `/filmes`: every film article, first page
 * - `/filmes/pagina/2`: the second page
 * - `/filmes/etiqueta/memoria`: film articles marked with "memória"
 * - `/filmes/etiqueta/memoria/pagina/2`: the second page of that filter
 *
 * Every archive page is generated at build time, so the archive works without JavaScript and
 * every page has its own URL.
 */

/** Articles per archive page: four rows of three cards on wide screens. */
export const ARCHIVE_PAGE_SIZE = 12;

/** URL segments of the archive. No article may use them as its slug. */
export const ARCHIVE_SEGMENTS = {
  page: 'pagina',
  tag: 'etiqueta',
} as const;

export const RESERVED_ARTICLE_SLUGS: readonly string[] = Object.values(ARCHIVE_SEGMENTS);

export type ArchiveSelection = {
  category: Category;
  /** Slug of the tag the archive is filtered by, or `null` for every article. */
  tagSlug: string | null;
  pageNumber: number;
};

/** Path of one archive page. The first page has no page segment. */
export function getArchivePath({ category, tagSlug, pageNumber }: ArchiveSelection): string {
  const tagPart = tagSlug === null ? '' : `/${ARCHIVE_SEGMENTS.tag}/${tagSlug}`;
  const pagePart = pageNumber > 1 ? `/${ARCHIVE_SEGMENTS.page}/${pageNumber}` : '';
  return `${getCategoryPath(category)}${tagPart}${pagePart}`;
}
