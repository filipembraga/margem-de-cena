import type { Category } from '@/lib/categories';

import { toSummary, type ContentCatalog } from './resolve';
import type {
  Article,
  ArticleSummary,
  Author,
  Page,
  PageSlug,
  Section,
  TagReference,
  TwoPerspectives,
} from './types';

/**
 * Pure functions that answer questions about a loaded catalog. `index.ts` binds them to the
 * catalog of the current environment; tests call them with a catalog built from fixtures.
 */

export type ArticleFilter = {
  category?: Category;
  authorSlug?: string;
  tagSlug?: string;
  /** Leaves these articles out, e.g. the home page hero from the "Recentes" grid. */
  excludeSlugs?: readonly string[];
  limit?: number;
};

export function selectArticles(
  catalog: ContentCatalog,
  filter: ArticleFilter = {},
): ArticleSummary[] {
  const { category, authorSlug, tagSlug, excludeSlugs = [], limit } = filter;

  const matchingArticles = catalog.articles.filter(
    (article) =>
      (category === undefined || article.category === category) &&
      (authorSlug === undefined || article.authors.some((author) => author.slug === authorSlug)) &&
      (tagSlug === undefined || article.tags.some((tag) => tag.slug === tagSlug)) &&
      !excludeSlugs.includes(article.slug),
  );

  return matchingArticles.slice(0, limit).map(toSummary);
}

export function selectArticle(
  catalog: ContentCatalog,
  category: Category,
  slug: string,
): Article | null {
  return (
    catalog.articles.find((article) => article.category === category && article.slug === slug) ??
    null
  );
}

/** The article marked as featured, or the most recent one when none is. */
export function selectFeaturedArticle(catalog: ContentCatalog): ArticleSummary | null {
  const featuredArticle =
    catalog.articles.find((article) => article.isFeatured) ?? catalog.articles[0];
  return featuredArticle ? toSummary(featuredArticle) : null;
}

export type AdjacentArticles = {
  /** Published just before this one (older). */
  previous: ArticleSummary | null;
  /** Published just after this one (newer). */
  next: ArticleSummary | null;
};

/** The neighbours of an article in publication order, across all categories. */
export function selectAdjacentArticles(catalog: ContentCatalog, slug: string): AdjacentArticles {
  // Articles are sorted most recent first, so the older neighbour comes after in the list.
  const index = catalog.articles.findIndex((article) => article.slug === slug);
  if (index === -1) {
    return { previous: null, next: null };
  }

  const previousArticle = catalog.articles[index + 1];
  const nextArticle = index > 0 ? catalog.articles[index - 1] : undefined;
  return {
    previous: previousArticle ? toSummary(previousArticle) : null,
    next: nextArticle ? toSummary(nextArticle) : null,
  };
}

/** How much each kind of affinity counts when choosing related articles. */
const RELATEDNESS_WEIGHTS = {
  sameWork: 4,
  sharedTag: 2,
  sameCategory: 1,
} as const;

function scoreRelatedness(article: Article, candidate: Article): number {
  const tagSlugs = new Set(article.tags.map((tag) => tag.slug));
  const sharedTagCount = candidate.tags.filter((tag) => tagSlugs.has(tag.slug)).length;
  const isSameWork = article.work !== null && candidate.work?.slug === article.work.slug;

  return (
    (isSameWork ? RELATEDNESS_WEIGHTS.sameWork : 0) +
    sharedTagCount * RELATEDNESS_WEIGHTS.sharedTag +
    (candidate.category === article.category ? RELATEDNESS_WEIGHTS.sameCategory : 0)
  );
}

/**
 * "Leia também": the articles closest to this one (same work, shared tags, same category),
 * filled with the most recent ones when few are related. The companion text of a Duas
 * Leituras entry is left out, since the article already links to it.
 */
export function selectRelatedArticles(
  catalog: ContentCatalog,
  slug: string,
  limit: number,
): ArticleSummary[] {
  const article = catalog.articles.find((candidate) => candidate.slug === slug);
  if (!article) {
    return [];
  }

  const candidates = catalog.articles.filter(
    (candidate) =>
      candidate.slug !== article.slug &&
      (article.twoPerspectivesSlug === null ||
        candidate.twoPerspectivesSlug !== article.twoPerspectivesSlug),
  );

  // Candidates are already most recent first, and the sort is stable, so ties keep that order.
  return candidates
    .map((candidate) => ({ candidate, score: scoreRelatedness(article, candidate) }))
    .sort((first, second) => second.score - first.score)
    .slice(0, limit)
    .map(({ candidate }) => toSummary(candidate));
}

/** Sections with at least one visible entry. Empty sections are hidden everywhere. */
export function selectSectionsWithContent(catalog: ContentCatalog): Set<Section> {
  const sections = new Set<Section>(catalog.articles.map((article) => article.category));
  if (catalog.twoPerspectives.length > 0) {
    sections.add('two-perspectives');
  }
  return sections;
}

export function selectAuthor(catalog: ContentCatalog, slug: string): Author | null {
  return catalog.authors.find((author) => author.slug === slug) ?? null;
}

export function selectTwoPerspectives(
  catalog: ContentCatalog,
  slug: string,
): TwoPerspectives | null {
  return catalog.twoPerspectives.find((entry) => entry.slug === slug) ?? null;
}

export function selectPage(catalog: ContentCatalog, slug: PageSlug): Page {
  const page = catalog.pages.find((candidate) => candidate.slug === slug);
  if (!page) {
    // The integrity stage requires every page, so this only happens with a broken source.
    throw new Error(`Page "${slug}" is missing from the content catalog.`);
  }
  return page;
}

/** Every tag used by a visible article, alphabetically. */
export function selectTags(catalog: ContentCatalog): TagReference[] {
  const tagsBySlug = new Map<string, TagReference>();
  for (const tag of catalog.articles.flatMap((article) => article.tags)) {
    tagsBySlug.set(tag.slug, tag);
  }
  return [...tagsBySlug.values()].sort((first, second) =>
    first.name.localeCompare(second.name, 'pt-BR'),
  );
}

export function selectTag(catalog: ContentCatalog, slug: string): TagReference | null {
  return selectTags(catalog).find((tag) => tag.slug === slug) ?? null;
}
