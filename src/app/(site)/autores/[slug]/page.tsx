import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ArticleList } from '@/components/cards/ArticleList';
import { AuthorAvatar } from '@/components/cards/AuthorCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildAuthorStructuredData } from '@/components/seo/structured-data';
import { EmptyState } from '@/components/ui/EmptyState';
import { getAuthor, getAuthors, getPublishedArticles, type Author } from '@/content';
import { environment } from '@/lib/env';
import { buildPageMetadata } from '@/lib/seo';
import { getInstagramUrl } from '@/lib/site-config';

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const authors = await getAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

async function readAuthor(params: AuthorPageProps['params']): Promise<Author> {
  const author = await getAuthor((await params).slug);
  if (!author) {
    notFound();
  }
  return author;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const author = await readAuthor(params);
  return buildPageMetadata({ title: author.name, description: author.shortBio, path: author.path });
}

/** An author's profile and everything they wrote, co-authored texts included. */
export default async function AuthorPage({ params }: AuthorPageProps) {
  const author = await readAuthor(params);
  const articles = await getPublishedArticles({ authorSlug: author.slug });
  const instagramUrl = author.instagramHandle ? getInstagramUrl(author.instagramHandle) : null;

  return (
    <div className="page-container pb-22">
      <JsonLd data={buildAuthorStructuredData(author, environment.siteUrl, instagramUrl)} />
      <header className="flex flex-col gap-6 border-b border-fg pt-14 pb-10 sm:flex-row sm:items-start lg:pt-18">
        <AuthorAvatar author={author} size={112} />
        <div className="flex max-w-170 flex-col gap-4">
          <p className="type-kicker text-accent">Autoria</p>
          <h1 className="type-article-title">{author.name}</h1>
          <p className="type-excerpt-large text-fg-soft">{author.fullBio}</p>
          {instagramUrl && (
            <p>
              <a
                href={instagramUrl}
                rel="noopener noreferrer"
                target="_blank"
                className="type-meta link-body"
              >
                @{author.instagramHandle}
                <span className="sr-only"> no Instagram (abre em nova aba)</span>
              </a>
            </p>
          )}
        </div>
      </header>

      <section aria-labelledby="textos" className="pt-12">
        <h2 id="textos" className="mb-8 type-label">
          Textos
        </h2>
        {articles.length > 0 ? (
          <ArticleList articles={articles} headingLevel="h3" />
        ) : (
          <EmptyState title="Por enquanto, nada publicado." />
        )}
      </section>
    </div>
  );
}
