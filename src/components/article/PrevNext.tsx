import Link from 'next/link';

import type { AdjacentArticles, ArticleSummary } from '@/content';
import { classNames } from '@/lib/class-names';

/** "← Anterior" and "Próximo →": the articles published just before and just after. */
export function PrevNext({ previous, next }: AdjacentArticles) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label="Artigos anterior e seguinte"
      className="page-container flex flex-wrap justify-between gap-6 pt-14"
    >
      {previous && <AdjacentLink article={previous} direction="previous" />}
      {next && <AdjacentLink article={next} direction="next" />}
    </nav>
  );
}

function AdjacentLink({
  article,
  direction,
}: {
  article: ArticleSummary;
  direction: 'previous' | 'next';
}) {
  const isNext = direction === 'next';

  return (
    <Link
      href={article.path}
      rel={isNext ? 'next' : 'prev'}
      className={classNames(
        'group flex flex-[1_1_20rem] flex-col gap-1.5 border-t border-fg pt-3.5',
        // A lone "next" link still sits on the right, where the reader expects it.
        isNext && 'text-right sm:ml-auto',
      )}
    >
      <span className="type-meta-small text-muted">{isNext ? 'Próximo →' : '← Anterior'}</span>
      <span className="font-display text-[1.5rem] leading-tight font-medium group-hover:text-accent sm:text-[1.75rem]">
        {article.title}
      </span>
    </Link>
  );
}
