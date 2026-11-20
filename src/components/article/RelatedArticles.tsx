import { ArticleCard } from '@/components/cards/ArticleCard';
import { toArticleCardData } from '@/components/cards/article-card-data';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { ArticleSummary } from '@/content';

/** "Leia também": up to three related articles after the article ends. Hidden when empty. */
export function RelatedArticles({ articles }: { articles: ArticleSummary[] }) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="leia-tambem" className="page-container pt-14">
      <SectionHeading id="leia-tambem" title="Leia também" className="mb-7" />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard
            key={article.slug}
            article={toArticleCardData(article)}
            variant="brief"
            headingLevel="h3"
          />
        ))}
      </div>
    </section>
  );
}
