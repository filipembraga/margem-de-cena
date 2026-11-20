import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ArticleEndMatter } from '@/components/article/ArticleEndMatter';
import { ArticleHeader } from '@/components/article/ArticleHeader';
import { CompanionLink } from '@/components/article/CompanionLink';
import { WorkInfo } from '@/components/article/WorkInfo';
import { getArticleCoverSource } from '@/components/cards/article-card-data';
import { ArticleBody } from '@/components/mdx/ArticleBody';
import { Cover } from '@/components/ui/Cover';
import { getArticle, getPublishedArticles, getTwoPerspectives, type Article } from '@/content';
import { findCategoryBySlug, getCategoryDefinition } from '@/lib/categories';

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
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await readArticle(params);
  const twoPerspectives = article.twoPerspectivesSlug
    ? await getTwoPerspectives(article.twoPerspectivesSlug)
    : null;

  return (
    <article className="pb-22">
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
        </div>
        {/* The right column is the margin where notes are placed on wide screens. */}
        <div aria-hidden="true" className="hidden lg:block" />
      </div>

      {twoPerspectives && (
        <CompanionLink entry={twoPerspectives} currentArticleSlug={article.slug} />
      )}
    </article>
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
