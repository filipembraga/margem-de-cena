import { describe, expect, it } from 'vitest';

import {
  normalizeForSearch,
  prepareSearchIndex,
  searchDocuments,
  type SearchDocument,
} from './search';

function searchDocument(
  path: string,
  overrides: Partial<Omit<SearchDocument, 'searchableFields'>> & {
    searchableFields?: Partial<SearchDocument['searchableFields']>;
  } = {},
): SearchDocument {
  return {
    path,
    title: 'Sem título',
    kicker: 'Filmes',
    excerpt: 'Resumo.',
    authorNames: 'Filipe Braga',
    publishedAt: '2026-11-01',
    ...overrides,
    searchableFields: {
      work: '',
      tags: '',
      authors: 'Filipe Braga',
      summary: 'Resumo.',
      ...overrides.searchableFields,
    },
  };
}

function search(documents: SearchDocument[], query: string): string[] {
  return searchDocuments(prepareSearchIndex(documents), query).map((document) => document.path);
}

describe('normalizeForSearch', () => {
  it('removes accents, lowercases and collapses spaces', () => {
    expect(normalizeForSearch('  Memória   e LUTO ')).toBe('memoria e luto');
  });
});

describe('searchDocuments', () => {
  const documents = [
    searchDocument('/filmes/a-mare', {
      title: 'A maré que não volta',
      searchableFields: { work: 'A casa das marés', tags: 'memória luto' },
    }),
    searchDocument('/livros/a-gaveta', {
      title: 'A gaveta como arquitetura do romance',
      authorNames: 'Adriana Guimarães',
      publishedAt: '2026-11-05',
      searchableFields: { authors: 'Adriana Guimarães', summary: 'Sobre memória e cartas.' },
    }),
  ];

  it('ignores accents and case', () => {
    expect(search(documents, 'MARE')).toEqual(['/filmes/a-mare']);
  });

  it('requires every word of the query', () => {
    expect(search(documents, 'memoria gaveta')).toEqual(['/livros/a-gaveta']);
    expect(search(documents, 'memoria inexistente')).toEqual([]);
  });

  it('ranks a match in the tags above a match in the summary', () => {
    // "memória" is a tag of the first article and only in the summary of the second,
    // which is more recent.
    expect(search(documents, 'memória')).toEqual(['/filmes/a-mare', '/livros/a-gaveta']);
  });

  it('finds articles by author', () => {
    expect(search(documents, 'adriana')).toEqual(['/livros/a-gaveta']);
  });

  it('returns nothing for an empty query', () => {
    expect(search(documents, '   ')).toEqual([]);
  });
});
