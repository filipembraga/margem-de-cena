import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ArticleEndMatter } from '@/components/article/ArticleEndMatter';
import { ArticleHeader } from '@/components/article/ArticleHeader';
import { CompanionLink } from '@/components/article/CompanionLink';
import { PrevNext } from '@/components/article/PrevNext';
import { RelatedArticles } from '@/components/article/RelatedArticles';
import { ShareBar } from '@/components/article/ShareBar';
import { WorkInfo } from '@/components/article/WorkInfo';
import { getArticleCoverSource } from '@/components/cards/article-card-data';
import { ArticleBody } from '@/components/mdx/ArticleBody';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildArticleStructuredData,
  buildBreadcrumbStructuredData,
  getArticleBreadcrumbs,
} from '@/components/seo/structured-data';
import { Cover } from '@/components/ui/Cover';
import {
  getAdjacentArticles,
  getArticle,
  getPublishedArticles,
  getRelatedArticles,
  getTwoPerspectives,
  type Article,
} from '@/content';
import { findCategoryBySlug, getCategoryDefinition } from '@/lib/categories';
import { environment } from '@/lib/env';
import { buildPageMetadata, toAbsoluteUrl } from '@/lib/seo';

type ArticlePageProps = {
  params: Promise<{ category: string; slug: string }>;
};

/** Every visible article is generated at build time; unknown slugs are a real 404. */
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ category: string; slug: string }>> {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({
    category: getCategoryDefinition(article.category).slug,
    slug: article.slug,
  }));
}

async function readArticle(params: ArticlePageProps['params']): Promise<Article> {
  const { category: categorySlug, slug } = await params;
  const category = findCategoryBySlug(categorySlug);
  const article = category ? await getArticle(category, slug) : null;

  if (!article) {
    notFound();
  }
  return article;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await readArticle(params);
  return buildPageMetadata({
    title: article.title,
    description: article.excerpt,
    path: article.path,
    hasOwnShareImage: true,
    article: {
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authorPaths: article.authors.map((author) => author.path),
      section: getCategoryDefinition(article.category).pluralLabel,
      tags: article.tags.map((tag) => tag.name),
    },
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await readArticle(params);
  const [twoPerspectives, adjacentArticles, relatedArticles] = await Promise.all([
    article.twoPerspectivesSlug ? getTwoPerspectives(article.twoPerspectivesSlug) : null,
    getAdjacentArticles(article.slug),
    getRelatedArticles(article.slug),
  ]);

  return (
    <div className="pb-22">
      <JsonLd data={buildArticleStructuredData(article, environment.siteUrl)} />
      <JsonLd
        data={buildBreadcrumbStructuredData(getArticleBreadcrumbs(article), environment.siteUrl)}
      />
      <article>
        <ArticleHeader article={article} />
        <ArticleCover article={article} />

        <div className="page-container grid justify-center gap-x-14 gap-y-8 pt-10 lg:grid-cols-[12.5rem_minmax(0,42.5rem)_12.5rem] lg:pt-14">
          <div>
            {article.work && (
              <WorkInfo work={article.work} hasSpoilerWarning={article.hasSpoilerWarning} />
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-10">
            <ArticleBody body={article.body} withDropCap />
            <ArticleEndMatter references={article.references} tags={article.tags} />
            <ShareBar
              url={toAbsoluteUrl(article.path)}
              title={article.title}
              storiesImagePath={`${article.path}/stories.png`}
            />
          </div>
          {/* The right column is the margin where notes are placed on wide screens. */}
          <div aria-hidden="true" className="hidden lg:block" />
        </div>

        {twoPerspectives && (
          <CompanionLink entry={twoPerspectives} currentArticleSlug={article.slug} />
        )}
      </article>

      <PrevNext {...adjacentArticles} />
      <RelatedArticles articles={relatedArticles} />
    </div>
  );
}

/** 21:9 on wide screens and 4:3 on small ones, with the image credit as the caption. */
function ArticleCover({ article }: { article: Article }) {
  return (
    <figure className="page-container flex flex-col gap-2.5">
      <Cover
        source={getArticleCoverSource(article)}
        aspectRatio="4:3"
        sizes="(min-width: 1240px) 1176px, 100vw"
        isPriority
        withCropMarks
        className="lg:aspect-[21/9]"
      />
      {article.cover && (
        <figcaption className="type-meta-small text-muted">
          {article.cover.credit} · {article.cover.license}
        </figcaption>
      )}
    </figure>
  );
}
