import { getArticlePath } from '@/lib/categories';
import { estimateReadingTimeInMinutes } from '@/lib/reading-time';

import type { ParsedArticle, ParsedContent, ParsedRecord } from './parse';
import type { AuthorData, ImageData, WorkData } from './schemas';
import type {
  Article,
  ArticleSummary,
  Author,
  ImageAsset,
  Page,
  PageSlug,
  TwoPerspectives,
  Work,
} from './types';

/**
 * Last stage of the pipeline: turns validated records into the domain types the queries
 * return. Runs only when there are no issues, so every reference is known to exist.
 * Drafts are dropped here: they never reach a page.
 */

export type ContentCatalog = {
  /** Visible articles, most recent first. */
  articles: Article[];
  authors: Author[];
  works: Work[];
  /** Duas Leituras entries, most recent first. */
  twoPerspectives: TwoPerspectives[];
  pages: Page[];
};

export const AUTHOR_PATH_PREFIX = '/autores';
export const TWO_PERSPECTIVES_PATH = '/duas-leituras';

export function resolveCatalog(content: ParsedContent): ContentCatalog {
  const authors = content.authors.map(resolveAuthor);
  const authorsBySlug = new Map(authors.map((author) => [author.slug, author]));
  const works = content.works.map(resolveWork);
  const worksBySlug = new Map(works.map((work) => [work.slug, work]));

  const twoPerspectivesSlugByArticle = new Map<string, string>();
  for (const { record, data } of content.twoPerspectives) {
    for (const articleSlug of data.articles) {
      twoPerspectivesSlugByArticle.set(articleSlug, record.slug);
    }
  }

  const articles = content.articles
    .filter(({ data }) => data.status !== 'draft')
    .map((article) =>
      resolveArticle(article, {
        authorsBySlug,
        worksBySlug,
        twoPerspectivesSlug: twoPerspectivesSlugByArticle.get(article.record.slug) ?? null,
      }),
    )
    .sort(byMostRecent);
  const articlesBySlug = new Map(articles.map((article) => [article.slug, article]));

  const twoPerspectives = content.twoPerspectives
    .map(({ record, data }) => {
      const [firstSlug, secondSlug] = data.articles;
      const firstArticle = requireValue(articlesBySlug.get(firstSlug ?? ''), firstSlug);
      const secondArticle = requireValue(articlesBySlug.get(secondSlug ?? ''), secondSlug);

      return {
        slug: record.slug,
        path: `${TWO_PERSPECTIVES_PATH}/${record.slug}`,
        work: requireValue(worksBySlug.get(data.work), data.work),
        introduction: data.introduction,
        perspectives: [
          { position: 1, article: toSummary(firstArticle) },
          { position: 2, article: toSummary(secondArticle) },
        ],
        publishedAt: [firstArticle.publishedAt, secondArticle.publishedAt].sort().at(-1) ?? '',
        isDemo: record.isDemo,
      } satisfies TwoPerspectives;
    })
    .sort(byMostRecent);

  const pages = content.pages.map(({ record, data, body }): Page => ({
    slug: record.slug as PageSlug,
    title: data.title,
    description: data.description,
    body: { format: 'mdx', compiledCode: body.compiledCode },
  }));

  return { articles, authors, works, twoPerspectives, pages };
}

/** Drops the body and references, which listings never need. */
export function toSummary(article: Article): ArticleSummary {
  const { body: _body, references: _references, ...summary } = article;
  return summary;
}

function resolveImage(image: ImageData | undefined): ImageAsset | null {
  return image ? { ...image } : null;
}

function resolveAuthor({ record, data }: ParsedRecord<AuthorData>): Author {
  return {
    slug: record.slug,
    name: data.name,
    path: `${AUTHOR_PATH_PREFIX}/${record.slug}`,
    shortBio: data.shortBio,
    fullBio: data.fullBio,
    profileImage: resolveImage(data.profileImage),
    instagramHandle: data.instagram ?? null,
  };
}

function resolveWork({ record, data }: ParsedRecord<WorkData>): Work {
  const base = {
    slug: record.slug,
    title: data.title,
    originalTitle: data.originalTitle ?? null,
    year: data.year ?? null,
    genre: data.genre ?? null,
    cover: resolveImage(data.cover),
    isDemo: record.isDemo,
  };

  switch (data.category) {
    case 'film':
      return {
        ...base,
        category: 'film',
        directors: data.directors,
        runtimeInMinutes: data.runtimeInMinutes ?? null,
      };
    case 'book':
      return {
        ...base,
        category: 'book',
        originalAuthors: data.originalAuthors,
        publisher: data.publisher ?? null,
        translator: data.translator ?? null,
        edition: data.edition ?? null,
      };
    case 'series':
      return {
        ...base,
        category: 'series',
        creators: data.creators,
        platform: data.platform ?? null,
        seasons: data.seasons ?? null,
      };
  }
}

type ArticleRelations = {
  authorsBySlug: Map<string, Author>;
  worksBySlug: Map<string, Work>;
  twoPerspectivesSlug: string | null;
};

function resolveArticle(
  { record, data, body, tags }: ParsedArticle,
  { authorsBySlug, worksBySlug, twoPerspectivesSlug }: ArticleRelations,
): Article {
  return {
    slug: record.slug,
    path: getArticlePath(data.category, record.slug),
    category: data.category,
    title: data.title,
    subtitle: data.subtitle ?? null,
    excerpt: data.excerpt,
    authors: data.authors.map((authorSlug) => {
      const author = requireValue(authorsBySlug.get(authorSlug), authorSlug);
      return { slug: author.slug, name: author.name, path: author.path };
    }),
    // Integrity guarantees a date for every article that is not a draft.
    publishedAt: data.publishedAt ?? '',
    updatedAt: data.updatedAt ?? null,
    readingTimeInMinutes: estimateReadingTimeInMinutes(body.wordCount),
    cover: resolveImage(data.cover),
    work: data.work ? requireValue(worksBySlug.get(data.work), data.work) : null,
    tags,
    isFeatured: data.featured,
    hasSpoilerWarning: data.spoilerWarning,
    isDemo: record.isDemo,
    twoPerspectivesSlug,
    references: data.references,
    body: { format: 'mdx', compiledCode: body.compiledCode },
  };
}

function byMostRecent(first: { publishedAt: string }, second: { publishedAt: string }): number {
  return second.publishedAt.localeCompare(first.publishedAt);
}

/** References were checked by the integrity stage; a miss here is a bug, not bad content. */
function requireValue<Value>(value: Value | undefined, reference: string | undefined): Value {
  if (value === undefined) {
    throw new Error(`Unresolved content reference "${reference}" after integrity checks.`);
  }
  return value;
}
