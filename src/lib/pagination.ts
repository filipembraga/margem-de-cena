/**
 * Splits a list into numbered pages. Page numbers start at 1, as in the URLs
 * (`/filmes/pagina/2`).
 */

export type PageOfItems<Item> = {
  items: Item[];
  pageNumber: number;
  pageCount: number;
  /** Position of the first item on this page, counting from 1 across all pages. */
  firstItemPosition: number;
};

/** Returns how many pages a list needs. An empty list still has one (empty) page. */
export function countPages(itemCount: number, pageSize: number): number {
  return Math.max(1, Math.ceil(itemCount / pageSize));
}

/** Returns one page of the list, or `null` when the page number is out of range. */
export function paginate<Item>(
  items: readonly Item[],
  pageNumber: number,
  pageSize: number,
): PageOfItems<Item> | null {
  const pageCount = countPages(items.length, pageSize);
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > pageCount) {
    return null;
  }

  const startIndex = (pageNumber - 1) * pageSize;
  return {
    items: items.slice(startIndex, startIndex + pageSize),
    pageNumber,
    pageCount,
    firstItemPosition: startIndex + 1,
  };
}

/**
 * Reads a page number from a URL segment. Only plain positive integers without leading zeros
 * count, so `/pagina/02` and `/pagina/1.5` are not pages.
 */
export function parsePageNumber(segment: string): number | null {
  return /^[1-9]\d*$/.test(segment) ? Number(segment) : null;
}
