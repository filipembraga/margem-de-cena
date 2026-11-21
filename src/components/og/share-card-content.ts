import { getArticleKicker } from '@/components/cards/article-card-data';
import { getPerspectiveAuthorNames } from '@/components/two-perspectives/two-perspectives-labels';
import type { ArticleSummary, TwoPerspectives } from '@/content';
import { getCategoryDefinition } from '@/lib/categories';
import { formatLongDate } from '@/lib/dates';

import type { ShareCardContent } from './OpenGraphCard';

/**
 * What the share cards say, in one place, so the link preview (1200 × 630) and the Instagram
 * post image (1080 × 1350) of the same page always match.
 */

/** An article: category and work, title, authors and date. */
export function describeArticleShareCard(article: ArticleSummary): ShareCardContent {
  const authorNames = article.authors.map((author) => author.name).join(' e ');
  return {
    kicker: getArticleKicker(article, { withWork: true }),
    title: article.title,
    footer: `Por ${authorNames} · ${formatLongDate(article.publishedAt)}`,
  };
}

/** A Duas Leituras entry: the work's title and the two authors who read it. */
export function describeTwoPerspectivesShareCard(entry: TwoPerspectives): ShareCardContent {
  return {
    kicker: `Duas Leituras · ${getCategoryDefinition(entry.work.category).pluralLabel}`,
    title: entry.work.title,
    footer: `Duas leituras independentes, por ${getPerspectiveAuthorNames(entry)}`,
    isTitleItalic: true,
  };
}
