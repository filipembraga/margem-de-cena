import type { ArticleSummary, Author, Work } from '@/content';
import { getCategoryDefinition, getCategoryPath } from '@/lib/categories';
import { toAbsoluteUrl } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

/**
 * schema.org data for search engines, as JSON-LD (docs/adr/0009). Pure functions: the caller
 * passes the site URL, so tests can check the output without environment variables.
 */

export type StructuredData = Record<string, unknown>;

const SCHEMA_CONTEXT = 'https://schema.org';

/** schema.org type of each kind of work. */
const WORK_TYPES: Record<Work['category'], string> = {
  film: 'Movie',
  book: 'Book',
  series: 'TVSeries',
};

function publisher(siteUrl: URL): StructuredData {
  return { '@type': 'Organization', name: siteConfig.name, url: toAbsoluteUrl('/', siteUrl) };
}

function toPeople(names: string[]): StructuredData[] {
  return names.map((name) => ({ '@type': 'Person', name }));
}

/** Who made the work, under the property schema.org uses for that kind of work. */
function describeWorkCreators(work: Work): StructuredData {
  switch (work.category) {
    case 'film':
      return { director: toPeople(work.directors) };
    case 'book':
      return { author: toPeople(work.originalAuthors) };
    case 'series':
      return { creator: toPeople(work.creators) };
  }
}

function describeWork(work: Work): StructuredData {
  return {
    '@type': WORK_TYPES[work.category],
    name: work.title,
    ...(work.originalTitle !== null && { alternateName: work.originalTitle }),
    ...(work.year !== null && { dateCreated: String(work.year) }),
    ...describeWorkCreators(work),
  };
}

/** An article: headline, authors, dates, the work it discusses and its tags. */
export function buildArticleStructuredData(article: ArticleSummary, siteUrl: URL): StructuredData {
  const url = toAbsoluteUrl(article.path, siteUrl);

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    url,
    mainEntityOfPage: url,
    // The generated share card has a hashed URL, so only a licensed cover is listed here.
    ...(article.cover !== null && { image: toAbsoluteUrl(article.cover.src, siteUrl) }),
    inLanguage: 'pt-BR',
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: article.authors.map((author) => ({
      '@type': 'Person',
      name: author.name,
      url: toAbsoluteUrl(author.path, siteUrl),
    })),
    publisher: publisher(siteUrl),
    ...(article.work !== null && { about: describeWork(article.work) }),
    ...(article.tags.length > 0 && { keywords: article.tags.map((tag) => tag.name).join(', ') }),
  };
}

/** An author's profile page, with their Instagram profile as another identity. */
export function buildAuthorStructuredData(
  author: Author,
  siteUrl: URL,
  instagramUrl: string | null,
): StructuredData {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'ProfilePage',
    url: toAbsoluteUrl(author.path, siteUrl),
    inLanguage: 'pt-BR',
    mainEntity: {
      '@type': 'Person',
      name: author.name,
      description: author.shortBio,
      url: toAbsoluteUrl(author.path, siteUrl),
      ...(instagramUrl !== null && { sameAs: [instagramUrl] }),
    },
  };
}

/** The publication itself, with the search page as its search action. */
export function buildWebsiteStructuredData(siteUrl: URL): StructuredData {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: toAbsoluteUrl('/', siteUrl),
    inLanguage: 'pt-BR',
    publisher: publisher(siteUrl),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${toAbsoluteUrl('/busca', siteUrl)}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export type BreadcrumbItem = {
  /** pt-BR label, e.g. "Filmes". */
  name: string;
  path: string;
};

/** First item of every trail. */
export const HOME_BREADCRUMB: BreadcrumbItem = { name: 'Início', path: '/' };

/**
 * Where a page sits in the site, from the home page down: "Início › Filmes › A maré que não
 * volta". Search engines may show it in place of the URL.
 */
export function buildBreadcrumbStructuredData(
  items: BreadcrumbItem[],
  siteUrl: URL,
): StructuredData {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path, siteUrl),
    })),
  };
}

/** An article's trail: home, its category archive, the article. */
export function getArticleBreadcrumbs(article: ArticleSummary): BreadcrumbItem[] {
  return [
    HOME_BREADCRUMB,
    {
      name: getCategoryDefinition(article.category).pluralLabel,
      path: getCategoryPath(article.category),
    },
    { name: article.title, path: article.path },
  ];
}
