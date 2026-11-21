import { notFound } from 'next/navigation';

import { renderShareImage } from '@/components/og/render-open-graph-image';
import { describeArticleShareCard } from '@/components/og/share-card-content';
import { getArticle, getPublishedArticles } from '@/content';
import { findCategoryBySlug, getCategoryDefinition } from '@/lib/categories';

/**
 * The article's card in the proportion of an Instagram post (4:5, 1080 × 1350), for the
 * authors to download and post: `/filmes/[slug]/instagram.png`. Same text as the link preview.
 * Generated at build time, for visible articles only.
 */

export const dynamic = 'force-static';
export const dynamicParams = false;

type ArticleInstagramImageContext = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateStaticParams(): Promise<Array<{ category: string; slug: string }>> {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({
    category: getCategoryDefinition(article.category).slug,
    slug: article.slug,
  }));
}

export async function GET(_request: Request, { params }: ArticleInstagramImageContext) {
  const { category: categorySlug, slug } = await params;
  const category = findCategoryBySlug(categorySlug);
  const article = category ? await getArticle(category, slug) : null;
  if (!article) {
    notFound();
  }

  return renderShareImage(describeArticleShareCard(article), 'instagram-post');
}
