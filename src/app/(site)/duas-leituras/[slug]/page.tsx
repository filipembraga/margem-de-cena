import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getWorkSummaryLine } from '@/components/article/work-facts';
import { getCoverSource } from '@/components/cards/article-card-data';
import {
  getPerspectiveAuthorNames,
  PERSPECTIVE_NUMERALS,
} from '@/components/two-perspectives/two-perspectives-labels';
import { Cover } from '@/components/ui/Cover';
import { DemoLabel } from '@/components/ui/DemoLabel';
import { Kicker } from '@/components/ui/Kicker';
import {
  getAllTwoPerspectives,
  getTwoPerspectives,
  type Perspective,
  type TwoPerspectives,
} from '@/content';
import { getCategoryDefinition } from '@/lib/categories';
import { formatShortDate, toDateTimeAttribute } from '@/lib/dates';

type TwoPerspectivesPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const entries = await getAllTwoPerspectives();
  return entries.map((entry) => ({ slug: entry.slug }));
}

async function readEntry(params: TwoPerspectivesPageProps['params']): Promise<TwoPerspectives> {
  const entry = await getTwoPerspectives((await params).slug);
  if (!entry) {
    notFound();
  }
  return entry;
}

export async function generateMetadata({ params }: TwoPerspectivesPageProps): Promise<Metadata> {
  const entry = await readEntry(params);
  return { title: `${entry.work.title} · Duas Leituras`, description: entry.introduction };
}

/** One work, two independent readings side by side, and the other entries below. */
export default async function TwoPerspectivesPage({ params }: TwoPerspectivesPageProps) {
  const entry = await readEntry(params);
  const otherEntries = (await getAllTwoPerspectives()).filter(
    (otherEntry) => otherEntry.slug !== entry.slug,
  );

  return (
    <>
      <div className="page-container pt-14 pb-22 lg:pt-18">
        <header className="grid items-center gap-x-12 gap-y-10 md:grid-cols-[minmax(0,18.75rem)_minmax(0,1fr)]">
          <Cover
            source={getCoverSource(entry.work.cover, { title: entry.work.title })}
            aspectRatio="3:4"
            sizes="(min-width: 768px) 300px, 100vw"
            isPriority
            withCropMarks
            className="max-w-75"
          />
          <div className="flex max-w-150 flex-col gap-5">
            {entry.isDemo && <DemoLabel className="self-start" />}
            <Kicker>
              Duas Leituras · {getCategoryDefinition(entry.work.category).singularLabel}
            </Kicker>
            <h1 className="type-article-title text-balance">{entry.work.title}</h1>
            <p className="type-meta text-muted">{getWorkSummaryLine(entry.work)}</p>
            <p className="type-excerpt-large text-fg-soft">{entry.introduction}</p>
          </div>
        </header>

        <div className="mt-10 grid border-t-[3px] border-double border-fg md:grid-cols-2">
          {entry.perspectives.map((perspective) => (
            <PerspectiveColumn key={perspective.position} perspective={perspective} />
          ))}
        </div>
      </div>

      {otherEntries.length > 0 && <OtherEntries entries={otherEntries} />}
    </>
  );
}

function PerspectiveColumn({ perspective: { position, article } }: { perspective: Perspective }) {
  const isFirst = position === 1;
  const authorNames = article.authors.map((author) => author.name).join(' e ');

  return (
    <article
      className={
        isFirst
          ? 'flex flex-col gap-5 py-10 md:pr-12'
          : 'flex flex-col gap-5 border-t border-fg py-10 md:border-t-0 md:border-l md:pl-12'
      }
    >
      <div className="flex items-center gap-3.5">
        <span aria-hidden="true" className="size-12 shrink-0 rounded-full bg-line" />
        <div className="type-meta-small text-muted">
          <p className="text-sm font-medium text-fg">{authorNames}</p>
          <p>
            <time dateTime={toDateTimeAttribute(article.publishedAt)}>
              {formatShortDate(article.publishedAt)}
            </time>{' '}
            · {article.readingTimeInMinutes} min
          </p>
        </div>
      </div>
      <p className="font-display text-[1.375rem] text-accent italic">
        Leitura {PERSPECTIVE_NUMERALS[position]}
      </p>
      <h2 className="font-display text-[2.25rem] leading-[1.05] font-medium sm:text-[2.75rem]">
        <Link href={article.path} className="hover:text-accent">
          {article.title}
        </Link>
      </h2>
      <p className="type-excerpt-large text-fg-soft">{article.excerpt}</p>
      <p>
        <Link href={article.path} className="type-meta link-body">
          Ler esta leitura<span className="sr-only">: {article.title}</span>
        </Link>
      </p>
    </article>
  );
}

function OtherEntries({ entries }: { entries: TwoPerspectives[] }) {
  return (
    <section aria-labelledby="outras-duas-leituras" className="bg-band">
      <div className="page-container py-14 lg:py-16">
        <h2 id="outras-duas-leituras" className="border-b border-fg pb-4 type-label">
          Outras Duas Leituras
        </h2>
        <ul>
          {entries.map((otherEntry) => (
            <li
              key={otherEntry.slug}
              className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-line py-6 last:border-b-0"
            >
              <Link
                href={otherEntry.path}
                className="font-display text-[2rem] leading-tight font-medium hover:text-accent sm:text-[2.5rem]"
              >
                {otherEntry.work.title}
              </Link>
              <p className="type-meta text-fg-soft">
                {getCategoryDefinition(otherEntry.work.category).singularLabel} ·{' '}
                {getPerspectiveAuthorNames(otherEntry)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
