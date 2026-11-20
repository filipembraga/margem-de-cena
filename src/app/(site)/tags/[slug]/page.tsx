import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ArticleList } from '@/components/cards/ArticleList';
import { PageHeader } from '@/components/layout/PageHeader';
import { getPublishedArticles, getTag, getTags, type TagReference } from '@/content';
import { buildPageMetadata } from '@/lib/seo';

type TagPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const tags = await getTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

async function readTag(params: TagPageProps['params']): Promise<TagReference> {
  const tag = await getTag((await params).slug);
  if (!tag) {
    notFound();
  }
  return tag;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = await readTag(params);
  return buildPageMetadata({
    title: tag.name,
    description: `Textos da Margem de Cena sobre ${tag.name}.`,
    path: tag.path,
  });
}

/** Every visible article marked with a tag, across all categories (ADR 0007). */
export default async function TagPage({ params }: TagPageProps) {
  const tag = await readTag(params);
  const articles = await getPublishedArticles({ tagSlug: tag.slug });
  const countLabel = articles.length === 1 ? '1 texto' : `${articles.length} textos`;

  return (
    <div className="page-container pb-22">
      <PageHeader kicker="Etiqueta" title={tag.name} description={countLabel} />
      <div className="pt-12">
        <ArticleList articles={articles} kickerWithWork />
      </div>
    </div>
  );
}
