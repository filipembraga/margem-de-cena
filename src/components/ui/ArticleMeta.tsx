import Link from 'next/link';
import { Fragment } from 'react';

import { classNames } from '@/lib/class-names';
import { formatLongDate, formatShortDate, toDateTimeAttribute, type PlainDate } from '@/lib/dates';

export type AuthorLink = {
  name: string;
  /** Author page; names render as plain text without it. */
  href?: string;
};

type DateStyle = 'long' | 'short' | 'day-and-month';

type ArticleMetaProps = {
  authors: AuthorLink[];
  publishedAt: PlainDate;
  readingTimeInMinutes?: number;
  dateStyle?: DateStyle;
  /** Writes "Por Filipe Braga" instead of "Filipe Braga". */
  withBylinePrefix?: boolean;
  /** Writes "11 min de leitura" instead of "11 min". */
  withReadingLabel?: boolean;
  size?: 'regular' | 'small';
  className?: string;
};

function formatDate(date: PlainDate, dateStyle: DateStyle): string {
  if (dateStyle === 'long') {
    return formatLongDate(date);
  }
  return formatShortDate(date, { includeYear: dateStyle === 'short' });
}

/**
 * Byline, date and reading time, separated by middle dots:
 * "Por Filipe Braga · 12 nov 2026 · 11 min". Co-authors are joined with "e".
 */
export function ArticleMeta({
  authors,
  publishedAt,
  readingTimeInMinutes,
  dateStyle = 'short',
  withBylinePrefix = false,
  withReadingLabel = false,
  size = 'regular',
  className,
}: ArticleMetaProps) {
  const readingTime =
    readingTimeInMinutes === undefined
      ? null
      : `${readingTimeInMinutes} min${withReadingLabel ? ' de leitura' : ''}`;

  return (
    <p
      className={classNames(
        size === 'small' ? 'type-meta-small' : 'type-meta',
        'text-muted',
        className,
      )}
    >
      {withBylinePrefix && 'Por '}
      <AuthorNames authors={authors} emphasize={withBylinePrefix} />
      {' · '}
      <time dateTime={toDateTimeAttribute(publishedAt)}>{formatDate(publishedAt, dateStyle)}</time>
      {readingTime && ` · ${readingTime}`}
    </p>
  );
}

function AuthorNames({ authors, emphasize }: { authors: AuthorLink[]; emphasize: boolean }) {
  const nameClassNames = emphasize ? 'font-medium text-fg' : undefined;

  return authors.map((author, index) => (
    <Fragment key={author.name}>
      {index > 0 && ' e '}
      {author.href ? (
        <Link href={author.href} className={classNames(nameClassNames, 'hover:text-accent')}>
          {author.name}
        </Link>
      ) : (
        <span className={nameClassNames}>{author.name}</span>
      )}
    </Fragment>
  ));
}
