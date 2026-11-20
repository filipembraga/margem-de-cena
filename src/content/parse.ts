import { z } from 'zod';

import type { ContentIssue } from './issues';
import { compileBody, type CompiledBody } from './mdx/compile';
import {
  articleFrontmatterSchema,
  authorSchema,
  pageFrontmatterSchema,
  twoPerspectivesSchema,
  workSchema,
  type ArticleFrontmatter,
  type AuthorData,
  type PageFrontmatter,
  type TwoPerspectivesData,
  type WorkData,
} from './schemas';
import type { RawContent, RawRecord } from './source';
import { buildArticleTags } from './tags';
import type { TagReference } from './types';

/**
 * First stage of the pipeline: each record on its own. Validates data against its schema
 * and compiles MDX bodies. Records with problems are left out and their issues returned.
 */

export type ParsedRecord<Data> = {
  record: RawRecord;
  data: Data;
};

export type ParsedArticle = ParsedRecord<ArticleFrontmatter> & {
  body: CompiledBody;
  tags: TagReference[];
};

export type ParsedPage = ParsedRecord<PageFrontmatter> & {
  body: CompiledBody;
};

export type ParsedContent = {
  articles: ParsedArticle[];
  authors: ParsedRecord<AuthorData>[];
  works: ParsedRecord<WorkData>[];
  twoPerspectives: ParsedRecord<TwoPerspectivesData>[];
  pages: ParsedPage[];
};

const portugueseErrorMessages = z.locales.pt().localeError;

type ParseOutcome<Data> = { data: Data; issues: [] } | { data: null; issues: ContentIssue[] };

function parseData<Data>(schema: z.ZodType<Data>, record: RawRecord): ParseOutcome<Data> {
  if (record.syntaxError) {
    return { data: null, issues: [{ origin: record.origin, message: record.syntaxError }] };
  }

  const result = schema.safeParse(record.data, { error: portugueseErrorMessages });
  if (result.success) {
    return { data: result.data, issues: [] };
  }

  return {
    data: null,
    issues: result.error.issues.map((issue) => ({
      origin: record.origin,
      message: issue.path.length > 0 ? `${issue.path.join('.')}: ${issue.message}` : issue.message,
    })),
  };
}

async function parseMdxRecord<Data>(
  schema: z.ZodType<Data>,
  record: RawRecord,
): Promise<{
  parsed: (ParsedRecord<Data> & { body: CompiledBody }) | null;
  issues: ContentIssue[];
}> {
  const outcome = parseData(schema, record);
  const compiled = await compileBody(record.body, record.origin);
  const bodyIssues = compiled.success
    ? []
    : compiled.issues.map((issue) => ({ origin: record.origin, ...issue }));

  if (outcome.data === null || !compiled.success) {
    return { parsed: null, issues: [...outcome.issues, ...bodyIssues] };
  }
  return { parsed: { record, data: outcome.data, body: compiled.body }, issues: [] };
}

function parseDataCollection<Data>(
  schema: z.ZodType<Data>,
  records: RawRecord[],
  issues: ContentIssue[],
): ParsedRecord<Data>[] {
  const parsedRecords: ParsedRecord<Data>[] = [];

  for (const record of records) {
    const outcome = parseData(schema, record);
    issues.push(...outcome.issues);
    if (outcome.data !== null) {
      parsedRecords.push({ record, data: outcome.data });
    }
  }
  return parsedRecords;
}

/** Validates and compiles every record. */
export async function parseContent(
  raw: RawContent,
): Promise<{ content: ParsedContent; issues: ContentIssue[] }> {
  const issues: ContentIssue[] = [];

  const articleResults = await Promise.all(
    raw.articles.map((record) => parseMdxRecord(articleFrontmatterSchema, record)),
  );
  const articles: ParsedArticle[] = [];
  for (const result of articleResults) {
    issues.push(...result.issues);
    if (result.parsed) {
      const { body, data } = result.parsed;
      articles.push({ ...result.parsed, tags: buildArticleTags(body.tagMentions, data.tags) });
    }
  }

  const pageResults = await Promise.all(
    raw.pages.map((record) => parseMdxRecord(pageFrontmatterSchema, record)),
  );
  const pages: ParsedPage[] = [];
  for (const result of pageResults) {
    issues.push(...result.issues);
    if (result.parsed) {
      pages.push(result.parsed);
    }
  }

  const content: ParsedContent = {
    articles,
    pages,
    authors: parseDataCollection(authorSchema, raw.authors, issues),
    works: parseDataCollection(workSchema, raw.works, issues),
    twoPerspectives: parseDataCollection(twoPerspectivesSchema, raw.twoPerspectives, issues),
  };

  return { content, issues };
}
