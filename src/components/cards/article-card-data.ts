import type { AuthorLink } from '@/components/ui/ArticleMeta';
import type { CoverSource } from '@/components/ui/Cover';
import type { ArticleSummary, AuthorReference, ImageAsset } from '@/content';
import { getCategoryDefinition } from '@/lib/categories';

import type { ArticleCardData } from './ArticleCard';

/**
 * Maps content-layer types to the presentational shapes of cards and covers, so the cards stay
 * independent of where the content comes from.
 */

export function toAuthorLinks(authors: AuthorReference[]): AuthorLink[] {
  return authors.map((author) => ({ name: author.name, href: author.path }));
}

/** The licensed image, or the typographic cover with the work (or article) title. */
export function getCoverSource(
  cover: ImageAsset | null,
  fallback: { title: string; kicker?: string },
): CoverSource {
  return cover ? { kind: 'image', image: cover } : { kind: 'fallback', ...fallback };
}

/** Cards already show the category above the title, so the typographic cover carries no kicker. */
export function getArticleCoverSource(article: ArticleSummary): CoverSource {
  return getCoverSource(article.cover, { title: article.work?.title ?? article.title });
}

/** "Filmes", or "Filmes · A casa das marés" when the work is shown. */
export function getArticleKicker(
  article: ArticleSummary,
  options: { withWork?: boolean } = {},
): string {
  const categoryLabel = getCategoryDefinition(article.category).pluralLabel;
  return options.withWork && article.work
    ? `${categoryLabel} · ${article.work.title}`
    : categoryLabel;
}

export function toArticleCardData(
  article: ArticleSummary,
  options: { kickerWithWork?: boolean } = {},
): ArticleCardData {
  return {
    href: article.path,
    title: article.title,
    kicker: getArticleKicker(article, { withWork: options.kickerWithWork }),
    excerpt: article.excerpt,
    authors: toAuthorLinks(article.authors),
    publishedAt: article.publishedAt,
    readingTimeInMinutes: article.readingTimeInMinutes,
    cover: getArticleCoverSource(article),
  };
}
