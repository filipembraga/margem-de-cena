import Link from 'next/link';

import { ArticleMeta, type AuthorLink } from '@/components/ui/ArticleMeta';
import { Cover, type CoverSource } from '@/components/ui/Cover';
import { Kicker } from '@/components/ui/Kicker';
import type { PlainDate } from '@/lib/dates';

/**
 * What a card needs to show an article. Presentational on purpose: `toArticleCardData`
 * (article-card-data.ts) maps the content layer's `ArticleSummary` to this shape.
 */
export type ArticleCardData = {
  href: string;
  title: string;
  /** Category label, optionally followed by the work: "Filmes · A casa das marés". */
  kicker: string;
  excerpt?: string;
  authors: AuthorLink[];
  publishedAt: PlainDate;
  readingTimeInMinutes?: number;
  cover: CoverSource;
};

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

type ArticleCardProps = {
  article: ArticleCardData;
  /**
   * `default`: cover, kicker, title, excerpt and meta (grids such as "Recentes").
   * `compact`: title and meta under a hairline (lists inside a category block).
   * `featured`: the home page hero, large cover with crop marks beside the text.
   * `numbered`: an essay row with an italic numeral (requires `position`).
   * `brief`: cover, kicker and title only ("Leia também" at the end of an article).
   */
  variant?: 'default' | 'compact' | 'featured' | 'numbered' | 'brief';
  headingLevel?: HeadingLevel;
  /** 1-based position, shown as "01", "02" in the numbered variant. */
  position?: number;
};

export function ArticleCard({
  article,
  variant = 'default',
  headingLevel = 'h3',
  position = 1,
}: ArticleCardProps) {
  switch (variant) {
    case 'featured':
      return <FeaturedCard article={article} headingLevel={headingLevel} />;
    case 'compact':
      return <CompactCard article={article} headingLevel={headingLevel} />;
    case 'numbered':
      return <NumberedCard article={article} headingLevel={headingLevel} position={position} />;
    case 'brief':
      return <BriefCard article={article} headingLevel={headingLevel} />;
    default:
      return <DefaultCard article={article} headingLevel={headingLevel} />;
  }
}

type CardVariantProps = {
  article: ArticleCardData;
  headingLevel: HeadingLevel;
};

/** The title is the card's only link; its text is the link's accessible name. */
function TitleLink({ article, className }: { article: ArticleCardData; className?: string }) {
  return (
    <Link href={article.href} className={className ?? 'hover:text-accent'}>
      {article.title}
    </Link>
  );
}

function DefaultCard({ article, headingLevel: Heading }: CardVariantProps) {
  return (
    <article className="flex flex-col gap-3">
      <Cover source={article.cover} aspectRatio="3:2" />
      <Kicker>{article.kicker}</Kicker>
      <Heading className="type-card-title">
        <TitleLink article={article} />
      </Heading>
      {article.excerpt && <p className="type-excerpt text-fg-soft">{article.excerpt}</p>}
      <ArticleMeta
        authors={article.authors}
        publishedAt={article.publishedAt}
        dateStyle="day-and-month"
        size="small"
      />
    </article>
  );
}

function BriefCard({ article, headingLevel: Heading }: CardVariantProps) {
  return (
    <article className="flex flex-col gap-2.5">
      <Cover source={article.cover} aspectRatio="3:2" />
      <Kicker>{article.kicker}</Kicker>
      <Heading className="type-card-title">
        <TitleLink article={article} />
      </Heading>
    </article>
  );
}

function CompactCard({ article, headingLevel: Heading }: CardVariantProps) {
  return (
    <article className="flex flex-col gap-1.5 border-t border-line pt-3">
      <Heading className="font-reading text-base leading-snug">
        <TitleLink article={article} />
      </Heading>
      <ArticleMeta
        authors={article.authors}
        publishedAt={article.publishedAt}
        dateStyle="day-and-month"
        size="small"
      />
    </article>
  );
}

function FeaturedCard({ article, headingLevel: Heading }: CardVariantProps) {
  return (
    <article className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,21.25rem)] lg:gap-12">
      <Cover source={article.cover} aspectRatio="16:10" withCropMarks />
      <div className="flex flex-col gap-4.5">
        <p className="font-display text-[1.375rem] text-accent italic">Em destaque</p>
        <Kicker>{article.kicker}</Kicker>
        <Heading className="type-hero-title">
          <TitleLink article={article} />
        </Heading>
        {article.excerpt && <p className="type-excerpt-large text-fg-soft">{article.excerpt}</p>}
        <ArticleMeta
          authors={article.authors}
          publishedAt={article.publishedAt}
          readingTimeInMinutes={article.readingTimeInMinutes}
          withBylinePrefix
        />
      </div>
    </article>
  );
}

function NumberedCard({
  article,
  headingLevel: Heading,
  position,
}: CardVariantProps & { position: number }) {
  const numeral = String(position).padStart(2, '0');

  return (
    // The title link stretches over the whole row, so the row is clickable but announced once.
    <article className="relative flex flex-wrap items-baseline gap-x-10 gap-y-2 border-b border-line py-7">
      <span aria-hidden="true" className="w-12 font-display text-[1.75rem] text-accent italic">
        {numeral}
      </span>
      <Heading className="flex-[1_1_26rem] font-display text-[2rem] leading-none font-medium sm:text-[2.5rem]">
        <TitleLink article={article} className="after:absolute after:inset-0 hover:text-accent" />
      </Heading>
      <p className="type-meta text-muted">
        {article.authors.map((author) => author.name).join(' e ')}
        {article.readingTimeInMinutes !== undefined && ` · ${article.readingTimeInMinutes} min`}
      </p>
    </article>
  );
}
