import { describe, expect, it } from 'vitest';

import { buildCatalog } from '@/content/catalog';
import { articleInput, contentWith } from '@/content/testing/fixtures';
import { createInMemorySource } from '@/content/testing/in-memory-source';

import { buildArticleStructuredData, buildWebsiteStructuredData } from './structured-data';

const SITE_URL = new URL('https://margemdecena.example');

describe('buildArticleStructuredData', () => {
  it('describes the article, its authors and the work it discusses', async () => {
    const source = createInMemorySource(
      contentWith({
        articles: [articleInput('a-mare', { work: 'a-casa', tags: ['memória', 'luto'] })],
      }),
    );
    const [article] = (await buildCatalog(source, { includeDemo: false })).articles;
    if (!article) {
      throw new Error('The sample article is missing.');
    }

    const data = buildArticleStructuredData(article, SITE_URL);

    expect(data).toMatchObject({
      '@type': 'Article',
      headline: 'Título de a-mare',
      url: 'https://margemdecena.example/filmes/a-mare',
      datePublished: '2026-11-12',
      dateModified: '2026-11-12',
      inLanguage: 'pt-BR',
      author: [
        {
          '@type': 'Person',
          name: 'Filipe Braga',
          url: 'https://margemdecena.example/autores/filipe-braga',
        },
      ],
      about: { '@type': 'Movie', name: 'A casa' },
      keywords: 'memória, luto',
    });
    // Without a licensed cover there is no image to list.
    expect(data).not.toHaveProperty('image');
  });
});

describe('buildWebsiteStructuredData', () => {
  it('declares the search page as the site search', () => {
    const data = buildWebsiteStructuredData(SITE_URL);

    expect(data.potentialAction).toMatchObject({
      '@type': 'SearchAction',
      target: 'https://margemdecena.example/busca?q={search_term_string}',
    });
  });
});
