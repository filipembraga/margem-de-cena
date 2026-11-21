import type { ContentIssue } from './issues';
import { toFileLine, type ParsedContent, type ParsedRecord } from './parse';

/**
 * Provisional texts are marked `[A PREENCHER: what is missing]` (docs/como-publicar.md).
 * `scripts/list-placeholders.mjs` lists them at any time; this check makes the production
 * build fail while any is left in published content or author data, so a placeholder never
 * goes live. Drafts and demonstration content are not checked: neither is published.
 */

export const PLACEHOLDER_MARKER = '[A PREENCHER';

/** Every string inside a record's data, however deeply nested (bios, captions, credits). */
function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap(collectStrings);
  }
  if (value !== null && typeof value === 'object') {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
}

/** The marker and what follows it, up to its closing bracket, to quote in the message. */
function quotePlaceholder(text: string): string {
  const start = text.indexOf(PLACEHOLDER_MARKER);
  const end = text.indexOf(']', start);
  return end === -1 ? text.slice(start) : text.slice(start, end + 1);
}

function placeholderIssue(origin: string, text: string, line: number | null): ContentIssue {
  return {
    origin,
    line,
    message:
      `Texto provisório em conteúdo publicado: "${quotePlaceholder(text)}". ` +
      'Substitua pelo texto definitivo antes de publicar.',
  };
}

function findInRecord({ record, data }: ParsedRecord<unknown>): ContentIssue[] {
  const dataIssues = collectStrings(data)
    .filter((text) => text.includes(PLACEHOLDER_MARKER))
    .map((text) => placeholderIssue(record.origin, text, null));

  const bodyIssues = record.body
    .split('\n')
    .flatMap((text, index) =>
      text.includes(PLACEHOLDER_MARKER)
        ? [placeholderIssue(record.origin, text, toFileLine(index + 1, record))]
        : [],
    );

  return [...dataIssues, ...bodyIssues];
}

/** Placeholders left in what the site publishes: articles, pages, works, entries and authors. */
export function findPublishedPlaceholders(content: ParsedContent): ContentIssue[] {
  const publishedArticles = content.articles.filter(
    ({ record, data }) => !record.isDemo && data.status === 'published',
  );
  const records: ParsedRecord<unknown>[] = [
    ...publishedArticles,
    ...content.pages,
    ...content.authors,
    ...content.works.filter(({ record }) => !record.isDemo),
    ...content.twoPerspectives.filter(({ record }) => !record.isDemo),
  ];
  return records.flatMap(findInRecord);
}
