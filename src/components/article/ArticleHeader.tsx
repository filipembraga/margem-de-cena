import { toAuthorLinks } from '@/components/cards/article-card-data';
import { ArticleMeta } from '@/components/ui/ArticleMeta';
import { DemoLabel } from '@/components/ui/DemoLabel';
import { Kicker } from '@/components/ui/Kicker';
import type { ArticleSummary } from '@/content';
import { getCategoryDefinition } from '@/lib/categories';
import { formatLongDate, toDateTimeAttribute } from '@/lib/dates';

type ArticleHeaderProps = {
  article: ArticleSummary;
};

/**
 * Centered header: kicker, title, standfirst, byline with date and reading time, the date of
 * the last relevant revision when there is one, and the spoiler notice.
 */
export function ArticleHeader({ article }: ArticleHeaderProps) {
  const categoryLabel = getCategoryDefinition(article.category).pluralLabel;
  const kicker = article.twoPerspectivesSlug ? `${categoryLabel} · Duas Leituras` : categoryLabel;

  return (
    <header className="mx-auto flex max-w-230 flex-col items-center gap-5.5 px-5 pt-14 pb-10 text-center sm:px-8 lg:pt-18">
      {article.isDemo && <DemoLabel />}
      <Kicker>{kicker}</Kicker>
      <h1 className="type-article-title text-balance">{article.title}</h1>
      {article.subtitle && (
        <p className="max-w-160 type-standfirst text-pretty text-fg-soft">{article.subtitle}</p>
      )}
      <ArticleMeta
        authors={toAuthorLinks(article.authors)}
        publishedAt={article.publishedAt}
        readingTimeInMinutes={article.readingTimeInMinutes}
        dateStyle="long"
        withBylinePrefix
        withReadingLabel
        className="pt-2"
      />
      {article.updatedAt && (
        <p className="-mt-3 type-meta-small text-muted">
          Atualizado em{' '}
          <time dateTime={toDateTimeAttribute(article.updatedAt)}>
            {formatLongDate(article.updatedAt)}
          </time>
        </p>
      )}
      {article.hasSpoilerWarning && (
        <p className="border-y border-accent px-1 py-2 type-meta text-accent">
          Este texto comenta pontos da trama. Os trechos com spoiler estão sinalizados.
        </p>
      )}
    </header>
  );
}
