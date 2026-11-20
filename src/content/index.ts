import { cache } from 'react';

import type { Category } from '@/lib/categories';
import { environment } from '@/lib/env';

import { buildCatalog } from './catalog';
import type { ContentCatalog } from './resolve';
import {
  selectArticle,
  selectArticles,
  selectAuthor,
  selectFeaturedArticle,
  selectPage,
  selectSectionsWithContent,
  selectTag,
  selectTags,
  selectTwoPerspectives,
  type ArticleFilter,
} from './selectors';
import { createFilesystemSource } from './sources/filesystem';
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
 * The content layer's public API. Pages and components import from here and nowhere else in
 * `src/content`. "Published" means visible in this environment: `published` articles, plus
 * `demo` ones when SHOW_DEMO_CONTENT=true.
 */

export type * from './types';
export type { ArticleFilter } from './selectors';

function loadFreshCatalog(): Promise<ContentCatalog> {
  return buildCatalog(createFilesystemSource(), { includeDemo: environment.showDemoContent });
}

/** In development, content is reloaded on every request so edits show up without a restart. */
const loadCatalogForRequest = cache(loadFreshCatalog);
let buildTimeCatalog: Promise<ContentCatalog> | undefined;

function loadCatalog(): Promise<ContentCatalog> {
  if (process.env.NODE_ENV === 'development') {
    return loadCatalogForRequest();
  }
  buildTimeCatalog ??= loadFreshCatalog();
  return buildTimeCatalog;
}

/** Visible articles, most recent first, optionally filtered. */
export async function getPublishedArticles(filter?: ArticleFilter): Promise<ArticleSummary[]> {
  return selectArticles(await loadCatalog(), filter);
}

/** A visible article with its body, or `null` when the slug does not exist in that category. */
export async function getArticle(category: Category, slug: string): Promise<Article | null> {
  return selectArticle(await loadCatalog(), category, slug);
}

/** The home page hero: the featured article, or the most recent one. */
export async function getFeaturedArticle(): Promise<ArticleSummary | null> {
  return selectFeaturedArticle(await loadCatalog());
}

/** Sections that have visible content; the others are hidden from navigation and the home page. */
export async function getSectionsWithContent(): Promise<Set<Section>> {
  return selectSectionsWithContent(await loadCatalog());
}

export async function getAuthors(): Promise<Author[]> {
  return (await loadCatalog()).authors;
}

export async function getAuthor(slug: string): Promise<Author | null> {
  return selectAuthor(await loadCatalog(), slug);
}

/** Duas Leituras entries, most recent first. */
export async function getAllTwoPerspectives(): Promise<TwoPerspectives[]> {
  return (await loadCatalog()).twoPerspectives;
}

export async function getTwoPerspectives(slug: string): Promise<TwoPerspectives | null> {
  return selectTwoPerspectives(await loadCatalog(), slug);
}

export async function getPage(slug: PageSlug): Promise<Page> {
  return selectPage(await loadCatalog(), slug);
}

/** Every tag used by a visible article, alphabetically. */
export async function getTags(): Promise<TagReference[]> {
  return selectTags(await loadCatalog());
}

export async function getTag(slug: string): Promise<TagReference | null> {
  return selectTag(await loadCatalog(), slug);
}
