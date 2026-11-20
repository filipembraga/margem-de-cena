import Link from 'next/link';

import type { ArticleSummary, TwoPerspectives } from '@/content';

type CompanionLinkProps = {
  entry: TwoPerspectives;
  /** The article being read; the link points to the other one. */
  currentArticleSlug: string;
};

/** "Leia a outra perspectiva": closes a Duas Leituras article with a link to its companion. */
export function CompanionLink({ entry, currentArticleSlug }: CompanionLinkProps) {
  const companion = entry.perspectives.find(
    ({ article }) => article.slug !== currentArticleSlug,
  )?.article;

  if (!companion) {
    return null;
  }

  return (
    <section aria-label="A outra leitura" className="page-container mt-18">
      <div className="flex flex-wrap items-center gap-x-12 gap-y-6 bg-band p-6 sm:p-10">
        <div className="flex flex-[1_1_17.5rem] flex-col gap-1.5">
          <p className="type-kicker text-accent">
            <Link href={entry.path} className="hover:underline">
              Duas Leituras · {entry.work.title}
            </Link>
          </p>
          <p className="font-reading text-base leading-relaxed text-fg-soft">
            Este texto é uma das duas leituras sobre a mesma obra. A outra foi escrita de forma
            independente.
          </p>
        </div>
        <CompanionArticle article={companion} />
      </div>
    </section>
  );
}

function CompanionArticle({ article }: { article: ArticleSummary }) {
  const authorNames = article.authors.map((author) => author.name).join(' e ');

  return (
    <div className="flex flex-[2_1_26rem] flex-col gap-1.5 border-fg sm:border-l sm:pl-8">
      <p className="font-display text-xl text-accent italic">Leia a outra perspectiva</p>
      <p className="font-display text-[2rem] leading-none font-medium sm:text-[2.375rem]">
        <Link href={article.path} className="hover:text-accent">
          {article.title}
        </Link>
      </p>
      {/* fg-soft, not muted: muted text on the band falls below 4.5:1 contrast. */}
      <p className="type-meta text-fg-soft">
        {authorNames} · {article.readingTimeInMinutes} min
      </p>
    </div>
  );
}
