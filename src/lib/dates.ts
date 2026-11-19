/**
 * Date formatting for the reader-facing site (pt-BR).
 *
 * Content dates are plain calendar dates ("2026-11-12"), not instants. They are formatted
 * in UTC on purpose: `new Date('2026-11-12')` is midnight UTC, which would show as
 * 11 November if formatted in the São Paulo time zone.
 */

const LOCALE = 'pt-BR';
const TIME_ZONE = 'UTC';

const longDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: TIME_ZONE,
});

const shortDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: TIME_ZONE,
});

/** A calendar date written as `YYYY-MM-DD`. */
export type PlainDate = string;

function parsePlainDate(date: PlainDate): Date {
  const parsedDate = new Date(`${date}T00:00:00Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid calendar date: "${date}". Expected the format YYYY-MM-DD.`);
  }

  return parsedDate;
}

/** "12 de novembro de 2026" */
export function formatLongDate(date: PlainDate): string {
  return longDateFormatter.format(parsePlainDate(date));
}

/**
 * "12 nov 2026", or "12 nov" without the year.
 *
 * `Intl` writes the short pt-BR month with a trailing period and joins the parts with
 * "de" ("12 de nov. de 2026"), so the parts are reassembled to match the design.
 */
export function formatShortDate(date: PlainDate, options: { includeYear?: boolean } = {}): string {
  const { includeYear = true } = options;
  const parts = shortDateFormatter.formatToParts(parsePlainDate(date));

  const day = findPart(parts, 'day');
  const month = findPart(parts, 'month').replace('.', '');
  const year = findPart(parts, 'year');

  return includeYear ? `${day} ${month} ${year}` : `${day} ${month}`;
}

/** Machine-readable value for the `dateTime` attribute of `<time>`. */
export function toDateTimeAttribute(date: PlainDate): string {
  return parsePlainDate(date).toISOString().slice(0, 10);
}

function findPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  const part = parts.find((candidate) => candidate.type === type);

  if (!part) {
    throw new Error(`Date part "${type}" missing from the pt-BR formatter output.`);
  }

  return part.value;
}
