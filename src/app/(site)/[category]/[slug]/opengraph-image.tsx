import { notFound } from 'next/navigation';

import { OPEN_GRAPH_IMAGE_SIZE } from '@/components/og/OpenGraphCard';
import { renderOpenGraphImage } from '@/components/og/render-open-graph-image';
import { describeArticleShareCard } from '@/components/og/share-card-content';
import { getArticle, getPublishedArticles } from '@/content';
import { findCategoryBySlug, getCategoryDefinition } from '@/lib/categories';

/** An article's share card: category and work, title, authors and date. */

export const alt = 'Título do texto, autoria e data de publicação, com a marca Margem de Cena.';
export const size = OPEN_GRAPH_IMAGE_SIZE;
export const contentType = 'image/png';

type ArticleImageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateStaticParams(): Promise<Array<{ category: string; slug: string }>> {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({
    category: getCategoryDefinition(article.category).slug,
    slug: article.slug,
  }));
}

export default async function ArticleOpenGraphImage({ params }: ArticleImageProps) {
  const { category: categorySlug, slug } = await params;
  const category = findCategoryBySlug(categorySlug);
  const article = category ? await getArticle(category, slug) : null;
  if (!article) {
    notFound();
  }

  return renderOpenGraphImage(describeArticleShareCard(article));
}
