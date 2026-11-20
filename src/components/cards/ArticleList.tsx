import type { ArticleSummary } from '@/content';

import { ArticleCard } from './ArticleCard';
import { toArticleCardData } from './article-card-data';

type ArticleListProps = {
  articles: ArticleSummary[];
  /**
   * `grid`: cards with cover, three per row on wide screens.
   * `numbered`: essay rows with an italic numeral.
   */
  layout?: 'grid' | 'numbered';
  /** Shows the work after the category in each kicker, for lists that mix categories. */
  kickerWithWork?: boolean;
  headingLevel?: 'h2' | 'h3';
};

/** A list of article cards, used by archives, tag pages and author pages. */
export function ArticleList({
  articles,
  layout = 'grid',
  kickerWithWork = false,
  headingLevel = 'h2',
}: ArticleListProps) {
  if (layout === 'numbered') {
    return (
      <ol>
        {articles.map((article, index) => (
          <li key={article.slug}>
            <ArticleCard
              article={toArticleCardData(article)}
              variant="numbered"
              position={index + 1}
              headingLevel={headingLevel}
            />
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <li key={article.slug}>
          <ArticleCard
            article={toArticleCardData(article, { kickerWithWork })}
            headingLevel={headingLevel}
          />
        </li>
      ))}
    </ul>
  );
}
