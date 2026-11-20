import { describe, expect, it } from 'vitest';

import { buildCatalog } from './catalog';
import type { ContentCatalog } from './resolve';
import { selectAdjacentArticles, selectRelatedArticles } from './selectors';
import { articleInput, contentWith } from './testing/fixtures';
import { createInMemorySource } from './testing/in-memory-source';

/**
 * Five articles, oldest to newest. "a-mare" and "os-comodos" form a Duas Leituras entry about
 * the same film; "a-mare" and "o-corredor" share a tag.
 */
async function buildSampleCatalog(): Promise<ContentCatalog> {
  const source = createInMemorySource(
    contentWith({
      articles: [
        articleInput('a-mare', { publishedAt: '2026-11-01', work: 'a-casa', tags: ['memória'] }),
        articleInput('os-comodos', {
          publishedAt: '2026-11-03',
          work: 'a-casa',
          authors: ['adriana-guimaraes'],
        }),
        articleInput('as-cartas', { publishedAt: '2026-11-05', category: 'book' }),
        articleInput('o-corredor', { publishedAt: '2026-11-10', tags: ['memória'] }),
        articleInput('monstros', { publishedAt: '2026-11-12', category: 'essay' }),
      ],
      twoPerspectives: [
        {
          slug: 'a-casa',
          data: { work: 'a-casa', introduction: 'Introdução.', articles: ['a-mare', 'os-comodos'] },
        },
      ],
    }),
  );
  return buildCatalog(source, { includeDemo: false });
}

function slugOf(article: { slug: string } | null): string | null {
  return article?.slug ?? null;
}

describe('selectAdjacentArticles', () => {
  it('returns the older article as previous and the newer one as next', async () => {
    const catalog = await buildSampleCatalog();

    const { previous, next } = selectAdjacentArticles(catalog, 'as-cartas');

    expect(slugOf(previous)).toBe('os-comodos');
    expect(slugOf(next)).toBe('o-corredor');
  });

  it('has no next article for the most recent one and no previous for the oldest', async () => {
    const catalog = await buildSampleCatalog();

    expect(selectAdjacentArticles(catalog, 'monstros').next).toBeNull();
    expect(selectAdjacentArticles(catalog, 'a-mare').previous).toBeNull();
  });
});

describe('selectRelatedArticles', () => {
  it('ranks shared tags and category first, then fills with the most recent', async () => {
    const catalog = await buildSampleCatalog();

    const related = selectRelatedArticles(catalog, 'a-mare', 3);

    expect(related.map(slugOf)).toEqual(['o-corredor', 'monstros', 'as-cartas']);
  });

  it('leaves out the companion text of a Duas Leituras entry', async () => {
    const catalog = await buildSampleCatalog();

    const related = selectRelatedArticles(catalog, 'a-mare', 10);

    expect(related.map(slugOf)).not.toContain('os-comodos');
    expect(related.map(slugOf)).not.toContain('a-mare');
  });

  it('prefers a related article over more recent unrelated ones', async () => {
    const catalog = await buildSampleCatalog();

    const related = selectRelatedArticles(catalog, 'o-corredor', 1);

    // "a-mare" is the oldest, but shares a tag and the category with "o-corredor".
    expect(related.map(slugOf)).toEqual(['a-mare']);
  });
});
