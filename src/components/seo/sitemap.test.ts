import { describe, expect, it } from 'vitest';

import { buildCatalog } from '@/content/catalog';
import { articleInput, contentWith } from '@/content/testing/fixtures';
import { createInMemorySource } from '@/content/testing/in-memory-source';

import { buildSitemap } from './sitemap';

const SITE_URL = new URL('https://margemdecena.example');

async function buildSampleSitemap(): Promise<string[]> {
  const source = createInMemorySource(
    contentWith({
      articles: [
        articleInput('a-mare', { tags: ['memória'], updatedAt: '2026-11-14' }),
        articleInput('monstros', { status: 'demo', category: 'essay', tags: ['medo'] }),
      ],
    }),
  );
  const catalog = await buildCatalog(source, { includeDemo: true });

  const sitemap = buildSitemap(
    {
      articles: catalog.articles,
      twoPerspectives: catalog.twoPerspectives,
      authors: catalog.authors,
      pages: catalog.pages,
    },
    SITE_URL,
  );
  return sitemap.map((entry) => entry.url);
}

describe('buildSitemap', () => {
  it('lists the published articles, their sections and tags, authors and pages', async () => {
    const urls = await buildSampleSitemap();

    expect(urls).toEqual(
      expect.arrayContaining([
        'https://margemdecena.example/',
        'https://margemdecena.example/filmes',
        'https://margemdecena.example/filmes/a-mare',
        'https://margemdecena.example/tags/memoria',
        'https://margemdecena.example/autores/filipe-braga',
        'https://margemdecena.example/sobre',
      ]),
    );
  });

  it('never lists demonstration content, even when the catalog includes it', async () => {
    const urls = await buildSampleSitemap();

    expect(urls).not.toContain('https://margemdecena.example/ensaios/monstros');
    // The essay section and the tag exist only because of the demo article.
    expect(urls).not.toContain('https://margemdecena.example/ensaios');
    expect(urls).not.toContain('https://margemdecena.example/tags/medo');
  });
});
