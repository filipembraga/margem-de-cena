import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ArticleList } from '@/components/cards/ArticleList';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPublishedArticles } from '@/content';
import {
  CATEGORIES,
  findCategoryBySlug,
  getCategoryDefinition,
  getCategoryPath,
  type Category,
} from '@/lib/categories';
import { buildPageMetadata } from '@/lib/seo';

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

/** Only the four category slugs exist; anything else is a real 404. */
export const dynamicParams = false;

export function generateStaticParams(): Array<{ category: string }> {
  return CATEGORIES.map((category) => ({ category: getCategoryDefinition(category).slug }));
}

async function readCategory(params: CategoryPageProps['params']): Promise<Category> {
  const category = findCategoryBySlug((await params).category);
  if (!category) {
    notFound();
  }
  return category;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await readCategory(params);
  const definition = getCategoryDefinition(category);
  return buildPageMetadata({
    title: definition.pluralLabel,
    description: definition.description,
    path: getCategoryPath(category),
  });
}

/** Archive of one category: every visible article, most recent first. */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await readCategory(params);
  const definition = getCategoryDefinition(category);
  const articles = await getPublishedArticles({ category });

  return (
    <div className="page-container pb-22">
      <PageHeader title={definition.pluralLabel} description={definition.description} />
      <div className="pt-12">
        {articles.length > 0 ? (
          <ArticleList articles={articles} layout={category === 'essay' ? 'numbered' : 'grid'} />
        ) : (
          <EmptyState
            title="Por enquanto, nada publicado nesta seção."
            description="Os textos aparecem aqui assim que forem publicados."
          />
        )}
      </div>
    </div>
  );
}
