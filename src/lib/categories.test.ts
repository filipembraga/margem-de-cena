import { describe, expect, it } from 'vitest';

import {
  CATEGORIES,
  findCategoryBySlug,
  getArticlePath,
  getCategoryDefinition,
  getCategoryPath,
} from './categories';

describe('categories', () => {
  it('gives every category a unique URL slug', () => {
    const slugs = CATEGORIES.map((category) => getCategoryDefinition(category).slug);

    expect(new Set(slugs).size).toBe(CATEGORIES.length);
  });

  it('uses the pt-BR URL segments defined in CLAUDE.md', () => {
    expect(getCategoryPath('film')).toBe('/filmes');
    expect(getCategoryPath('book')).toBe('/livros');
    expect(getCategoryPath('series')).toBe('/series');
    expect(getCategoryPath('essay')).toBe('/ensaios');
  });

  it('finds a category from its URL slug', () => {
    expect(findCategoryBySlug('livros')).toBe('book');
    expect(findCategoryBySlug('podcasts')).toBeUndefined();
  });

  it('builds article paths inside the category segment', () => {
    expect(getArticlePath('film', 'a-mare-que-nao-volta')).toBe('/filmes/a-mare-que-nao-volta');
  });

  it('offers singular and plural labels', () => {
    expect(getCategoryDefinition('series')).toMatchObject({
      singularLabel: 'Série',
      pluralLabel: 'Séries',
    });
  });
});
