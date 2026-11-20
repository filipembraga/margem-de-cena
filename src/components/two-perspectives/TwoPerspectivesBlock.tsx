import Link from 'next/link';

import type { Perspective, TwoPerspectives } from '@/content';
import { classNames } from '@/lib/class-names';

import { getWorkCategoryLine, PERSPECTIVE_ORDINALS } from './two-perspectives-labels';

type TwoPerspectivesBlockProps = {
  entry: TwoPerspectives;
  /** Visible heading level of the work title. */
  headingLevel: 'h2' | 'h3';
  /** Text above the work title; on the home page it names the section. */
  label?: string;
  /** Lets a section use `aria-labelledby` on the label. */
  labelId?: string;
};

/**
 * A Duas Leituras entry in a listing: the work, its introduction and the two readings side by
 * side, separated by a vertical rule (stacked on small screens).
 */
export function TwoPerspectivesBlock({
  entry,
  headingLevel: Heading,
  label = 'Duas Leituras',
  labelId,
}: TwoPerspectivesBlockProps) {
  const perspectiveHeadingLevel = Heading === 'h2' ? 'h3' : 'h4';

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div className="flex flex-[1_1_26rem] flex-col gap-2.5">
          <p id={labelId} className="type-label text-accent">
            {label}
          </p>
          <Heading className="font-display text-[2.5rem] leading-[0.95] font-medium sm:text-[3.5rem]">
            <Link href={entry.path} className="hover:text-accent">
              {entry.work.title}
            </Link>
          </Heading>
          <p className="type-meta text-fg-soft">{getWorkCategoryLine(entry.work)}</p>
        </div>
        <p className="max-w-105 flex-[1_1_20rem] type-excerpt text-fg-soft">{entry.introduction}</p>
      </div>
      <div className="grid md:grid-cols-2">
        {entry.perspectives.map((perspective) => (
          <PerspectiveSummary
            key={perspective.position}
            perspective={perspective}
            headingLevel={perspectiveHeadingLevel}
          />
        ))}
      </div>
    </div>
  );
}

function PerspectiveSummary({
  perspective: { position, article },
  headingLevel: Heading,
}: {
  perspective: Perspective;
  headingLevel: 'h3' | 'h4';
}) {
  return (
    <article
      className={classNames(
        'flex flex-col gap-3.5 border-t border-fg py-8',
        position === 1 ? 'md:pr-10' : 'md:border-l md:pl-10',
      )}
    >
      <p className="font-display text-[1.375rem] text-accent italic">
        {PERSPECTIVE_ORDINALS[position]}
      </p>
      <Heading className="font-display text-[1.875rem] leading-[1.02] font-medium sm:text-[2.125rem]">
        <Link href={article.path} className="hover:text-accent">
          {article.title}
        </Link>
      </Heading>
      <p className="type-excerpt text-fg-soft">{article.excerpt}</p>
      <p className="type-meta font-medium">
        {article.authors.map((author) => author.name).join(' e ')}
      </p>
    </article>
  );
}
