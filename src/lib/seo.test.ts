import { describe, expect, it } from 'vitest';

import { buildPageMetadata, getRobotsDirective, toAbsoluteUrl } from './seo';

describe('buildPageMetadata', () => {
  it('sets the canonical URL and points to the site share card', () => {
    const metadata = buildPageMetadata({
      title: 'Filmes',
      description: 'Leituras de filmes.',
      path: '/filmes',
    });

    expect(metadata.alternates?.canonical).toBe('/filmes');
    expect(metadata.openGraph).toMatchObject({
      title: 'Filmes',
      url: '/filmes',
      locale: 'pt_BR',
      type: 'website',
      images: [expect.objectContaining({ url: '/opengraph-image' })],
    });
  });

  it('leaves the image to the route when it generates its own card', () => {
    const metadata = buildPageMetadata({
      title: 'A maré que não volta',
      description: 'Resumo.',
      path: '/filmes/a-mare',
      hasOwnShareImage: true,
    });

    expect(metadata.openGraph).not.toHaveProperty('images');
    expect(metadata.twitter).not.toHaveProperty('images');
  });

  it('describes articles with dates, absolute author URLs and tags', () => {
    const metadata = buildPageMetadata({
      title: 'A maré que não volta',
      description: 'Resumo.',
      path: '/filmes/a-mare',
      article: {
        publishedTime: '2026-11-12',
        modifiedTime: null,
        authorPaths: ['/autores/filipe-braga'],
        section: 'Filmes',
        tags: ['memória'],
      },
    });

    expect(metadata.openGraph).toMatchObject({
      type: 'article',
      publishedTime: '2026-11-12',
      authors: [toAbsoluteUrl('/autores/filipe-braga')],
      tags: ['memória'],
    });
    expect(metadata.openGraph).not.toHaveProperty('modifiedTime');
  });

  it('keeps hidden pages out of search engines', () => {
    const metadata = buildPageMetadata({
      title: 'Guia de estilo',
      description: 'Prévia.',
      path: '/styleguide',
      isHiddenFromSearchEngines: true,
    });

    // Outside production nothing is followed either (ADR 0004).
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});

describe('getRobotsDirective', () => {
  it('opens only the production deployment to search engines', () => {
    expect(
      getRobotsDirective({ isHiddenFromSearchEngines: false, isProductionDeployment: true }),
    ).toEqual({ index: true, follow: true });
    expect(
      getRobotsDirective({ isHiddenFromSearchEngines: false, isProductionDeployment: false }),
    ).toEqual({ index: false, follow: false });
  });

  it('keeps hidden pages out of the index on production, but follows their links', () => {
    expect(
      getRobotsDirective({ isHiddenFromSearchEngines: true, isProductionDeployment: true }),
    ).toEqual({ index: false, follow: true });
  });
});
