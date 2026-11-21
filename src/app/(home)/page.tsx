import type { Metadata } from 'next';
import Link from 'next/link';

import { ArticleCard } from '@/components/cards/ArticleCard';
import { toArticleCardData } from '@/components/cards/article-card-data';
import { ArticleList } from '@/components/cards/ArticleList';
import { AuthorCard } from '@/components/cards/AuthorCard';
import { CategoryBlock } from '@/components/home/CategoryBlock';
import { InstagramInvite } from '@/components/home/InstagramInvite';
import { chooseInstagramProfiles } from '@/components/home/instagram-profiles';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildWebsiteStructuredData } from '@/components/seo/structured-data';
import { TwoPerspectivesBlock } from '@/components/two-perspectives/TwoPerspectivesBlock';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  getAllTwoPerspectives,
  getAuthors,
  getFeaturedArticle,
  getPublishedArticles,
  type ArticleSummary,
  type Author,
  type TwoPerspectives,
} from '@/content';
import type { Category } from '@/lib/categories';
import { environment } from '@/lib/env';
import { buildPageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

const RECENT_ARTICLE_COUNT = 3;
const ARTICLES_PER_CATEGORY_BLOCK = 2;
const HOME_ESSAY_COUNT = 3;
const CATEGORIES_WITH_BLOCKS: Category[] = ['film', 'book', 'series'];

export const metadata: Metadata = buildPageMetadata({
  description: siteConfig.description,
  path: '/',
});

/**
 * The editorial showcase. Every block is hidden when it has nothing to show, so the page works
 * with three articles as well as with fifty.
 */
export default async function HomePage() {
  const featuredArticle = await getFeaturedArticle();

  if (!featuredArticle) {
    return <EmptyHomePage />;
  }

  const [recentArticles, twoPerspectivesEntries, essays, authors, categoryBlocks] =
    await Promise.all([
      getPublishedArticles({ excludeSlugs: [featuredArticle.slug], limit: RECENT_ARTICLE_COUNT }),
      getAllTwoPerspectives(),
      getPublishedArticles({ category: 'essay', limit: HOME_ESSAY_COUNT }),
      getAuthors(),
      Promise.all(
        CATEGORIES_WITH_BLOCKS.map(async (category) => ({
          category,
          articles: await getPublishedArticles({ category, limit: ARTICLES_PER_CATEGORY_BLOCK }),
        })),
      ),
    ]);
  const latestTwoPerspectives = twoPerspectivesEntries[0];
  const filledCategoryBlocks = categoryBlocks.filter(({ articles }) => articles.length > 0);

  return (
    <>
      <h1 className="sr-only">{siteConfig.name}</h1>
      <JsonLd data={buildWebsiteStructuredData(environment.siteUrl)} />

      <section aria-label="Em destaque" className="page-container pt-14 pb-18">
        <ArticleCard
          article={toArticleCardData(featuredArticle, { kickerWithWork: true })}
          variant="featured"
          headingLevel="h2"
        />
      </section>

      {recentArticles.length > 0 && <RecentArticles articles={recentArticles} />}

      {latestTwoPerspectives && (
        <TwoPerspectivesHighlight
          entry={latestTwoPerspectives}
          hasMoreEntries={twoPerspectivesEntries.length > 1}
        />
      )}

      {filledCategoryBlocks.length > 0 && (
        <div className="page-container grid gap-12 py-22 md:grid-cols-2 lg:grid-cols-3">
          {filledCategoryBlocks.map(({ category, articles }) => (
            <CategoryBlock key={category} category={category} articles={articles} />
          ))}
        </div>
      )}

      {essays.length > 0 && <SelectedEssays essays={essays} />}

      <WhoWrites authors={authors} />

      <InstagramInvite
        {...chooseInstagramProfiles(siteConfig.instagramHandle, siteConfig.name, authors)}
      />
    </>
  );
}

function EmptyHomePage() {
  return (
    <div className="page-container py-20 sm:py-28">
      <h1 className="sr-only">{siteConfig.name}</h1>
      <EmptyState
        headingLevel="h2"
        title="Por enquanto, nada publicado."
        description="Os primeiros textos da Margem de Cena chegam em breve."
        action={
          environment.showDemoContent ? (
            <ButtonLink href="/styleguide" variant="secondary">
              Ver guia de estilo
            </ButtonLink>
          ) : undefined
        }
      />
    </div>
  );
}

function RecentArticles({ articles }: { articles: ArticleSummary[] }) {
  return (
    <section aria-labelledby="recentes" className="page-container pb-22">
      <SectionHeading id="recentes" title="Recentes" className="mb-7" />
      <ArticleList articles={articles} headingLevel="h3" />
    </section>
  );
}

function TwoPerspectivesHighlight({
  entry,
  hasMoreEntries,
}: {
  entry: TwoPerspectives;
  hasMoreEntries: boolean;
}) {
  return (
    <section aria-labelledby="duas-leituras-destaque" className="bg-band">
      <div className="page-container flex flex-col gap-4 py-14 lg:py-18">
        <TwoPerspectivesBlock entry={entry} headingLevel="h2" labelId="duas-leituras-destaque" />
        {hasMoreEntries && (
          <Link href="/duas-leituras" className="self-start type-meta link-body">
            Todas as Duas Leituras
          </Link>
        )}
      </div>
    </section>
  );
}

function SelectedEssays({ essays }: { essays: ArticleSummary[] }) {
  return (
    <section aria-labelledby="ensaios" className="page-container pb-22">
      <SectionHeading
        id="ensaios"
        title="Ensaios"
        aside="textos longos e temáticos"
        className="mb-2"
      />
      <ArticleList articles={essays} layout="numbered" headingLevel="h3" />
    </section>
  );
}

function WhoWrites({ authors }: { authors: Author[] }) {
  return (
    <section
      aria-labelledby="quem-escreve"
      className="page-container grid gap-12 pb-22 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)]"
    >
      <div className="flex flex-col gap-4">
        <h2 id="quem-escreve" className="type-label">
          Quem escreve
        </h2>
        <p className="font-display text-[2rem] leading-[1.05] sm:text-[2.5rem]">
          Duas pessoas, dois modos de ler —{' '}
          <span className="text-accent italic">e as margens onde eles se encontram.</span>
        </p>
        <Link href="/sobre" className="self-start type-meta link-body">
          Sobre a Margem de Cena
        </Link>
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        {authors.map((author) => (
          <AuthorCard key={author.slug} author={author} />
        ))}
      </div>
    </section>
  );
}
