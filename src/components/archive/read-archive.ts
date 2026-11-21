import { notFound } from 'next/navigation';

import { getArchiveSelections, getCategoryArchive, type CategoryArchive } from '@/content';
import { type ArchiveSelection } from '@/lib/archive-paths';
import { findCategoryBySlug, getCategoryDefinition } from '@/lib/categories';
import { parsePageNumber } from '@/lib/pagination';

/**
 * Shared by the four archive routes (`/filmes`, `/filmes/pagina/2`, `/filmes/etiqueta/memoria`
 * and `/filmes/etiqueta/memoria/pagina/2`): turns the URL segments into an archive page, and
 * lists the segments to generate at build time.
 */

export type ArchiveRouteParams = {
  category: string;
  tag?: string;
  page?: string;
};

/** The archive page the URL points to, or a 404 when it does not exist. */
export async function readArchive(params: ArchiveRouteParams): Promise<CategoryArchive> {
  const category = findCategoryBySlug(params.category);
  const pageNumber = params.page === undefined ? 1 : parsePageNumber(params.page);
  // `/pagina/1` is not a page: the first page has no page segment.
  const isValidPage = pageNumber !== null && (params.page === undefined || pageNumber > 1);
  if (!category || !isValidPage) {
    notFound();
  }

  const archive = await getCategoryArchive({
    category,
    tagSlug: params.tag ?? null,
    pageNumber,
  });
  if (!archive) {
    notFound();
  }
  return archive;
}

function toRouteParams({ category, tagSlug, pageNumber }: ArchiveSelection): ArchiveRouteParams {
  return {
    category: getCategoryDefinition(category).slug,
    ...(tagSlug !== null && { tag: tagSlug }),
    ...(pageNumber > 1 && { page: String(pageNumber) }),
  };
}

type ArchiveRouteShape = { isFiltered: boolean; isPaginated: boolean };

/** The params of every archive page one route serves, e.g. filtered pages after the first. */
export async function listArchiveRouteParams({
  isFiltered,
  isPaginated,
}: ArchiveRouteShape): Promise<ArchiveRouteParams[]> {
  const selections = await getArchiveSelections();
  return selections
    .filter(
      (selection) =>
        (selection.tagSlug !== null) === isFiltered && selection.pageNumber > 1 === isPaginated,
    )
    .map(toRouteParams);
}
