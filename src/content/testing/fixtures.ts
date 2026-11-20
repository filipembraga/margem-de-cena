import type { InMemoryContent } from './in-memory-source';

/** Minimal valid content for tests: two authors, the required pages and one film. */

export const authors = [
  { slug: 'filipe-braga', data: { name: 'Filipe Braga', shortBio: 'Bio.', fullBio: 'Bio.' } },
  {
    slug: 'adriana-guimaraes',
    data: { name: 'Adriana Guimarães', shortBio: 'Bio.', fullBio: 'Bio.' },
  },
];

export const pages = ['sobre', 'contato', 'privacidade', 'creditos'].map((slug) => ({
  slug,
  data: { title: slug, description: 'Descrição.' },
  body: 'Texto.',
}));

export const filmWork = { slug: 'a-casa', data: { category: 'film', title: 'A casa' } };

type ArticleRecordInput = NonNullable<InMemoryContent['articles']>[number];

/** A valid published film article; `overrides` replaces frontmatter fields. */
export function articleInput(
  slug: string,
  overrides: Record<string, unknown> = {},
  body = 'Texto.',
): ArticleRecordInput {
  const isDemo = overrides.status === 'demo';
  return {
    slug,
    isDemo,
    body,
    data: {
      title: `Título de ${slug}`,
      excerpt: 'Resumo.',
      category: 'film',
      authors: ['filipe-braga'],
      status: 'published',
      publishedAt: '2026-11-12',
      ...overrides,
    },
  };
}

export function contentWith(extra: InMemoryContent): InMemoryContent {
  return {
    authors,
    pages,
    works: [filmWork],
    ...extra,
  };
}
