import Link from 'next/link';

import { getArticleCoverSource } from '@/components/cards/article-card-data';
import { Cover } from '@/components/ui/Cover';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { ArticleSummary } from '@/content';
import { getCategoryDefinition, getCategoryPath, type Category } from '@/lib/categories';

type CategoryBlockProps = {
  category: Category;
  /** The most recent articles of the category; the first one gets the cover. */
  articles: ArticleSummary[];
};

/**
 * One column of the home page's "Filmes / Livros / Séries" row. Books keep the natural 2:3
 * proportion of a cover, small, so the page never looks like a bookstore shelf.
 */
export function CategoryBlock({ category, articles }: CategoryBlockProps) {
  const [latestArticle, ...olderArticles] = articles;
  if (!latestArticle) {
    return null;
  }

  const definition = getCategoryDefinition(category);
  const isBook = category === 'book';

  return (
    <section aria-label={definition.pluralLabel} className="flex flex-col gap-4.5">
      <SectionHeading
        title={definition.pluralLabel}
        variant="display"
        link={{ label: 'Arquivo', href: getCategoryPath(category) }}
      />
      <Cover
        source={getArticleCoverSource(latestArticle)}
        aspectRatio={isBook ? '2:3' : '16:9'}
        sizes={isBook ? '140px' : '(min-width: 1024px) 380px, 100vw'}
        className={isBook ? 'w-35' : undefined}
      />
      <h3 className="type-card-title">
        <Link href={latestArticle.path} className="hover:text-accent">
          {latestArticle.title}
        </Link>
      </h3>
      {olderArticles.length > 0 && (
        <ul className="flex flex-col">
          {olderArticles.map((article) => (
            <li key={article.slug} className="border-t border-line py-3">
              <Link href={article.path} className="font-reading text-base hover:text-accent">
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
