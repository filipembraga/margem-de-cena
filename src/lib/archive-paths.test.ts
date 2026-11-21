import { describe, expect, it } from 'vitest';

import { getArchivePath } from './archive-paths';

describe('getArchivePath', () => {
  it('builds the first page without a page segment', () => {
    expect(getArchivePath({ category: 'film', tagSlug: null, pageNumber: 1 })).toBe('/filmes');
    expect(getArchivePath({ category: 'book', tagSlug: 'memoria', pageNumber: 1 })).toBe(
      '/livros/etiqueta/memoria',
    );
  });

  it('adds the page segment from the second page on', () => {
    expect(getArchivePath({ category: 'series', tagSlug: null, pageNumber: 2 })).toBe(
      '/series/pagina/2',
    );
    expect(getArchivePath({ category: 'essay', tagSlug: 'luto', pageNumber: 3 })).toBe(
      '/ensaios/etiqueta/luto/pagina/3',
    );
  });
});
