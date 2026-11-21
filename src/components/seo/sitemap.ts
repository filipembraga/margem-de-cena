import type { MetadataRoute } from 'next';

import type { ArticleSummary, Author, Page, TwoPerspectives } from '@/content';
import { ARCHIVE_PAGE_SIZE, getArchivePath } from '@/lib/archive-paths';
import { type Category } from '@/lib/categories';
import { countPages } from '@/lib/pagination';
import { toAbsoluteUrl } from '@/lib/seo';

/**
 * The sitemap's entries. Demonstration entries are left out here explicitly, even though a
 * production build never loads them: preview builds do, and their sitemap must not list them
 * (docs/adr/0004-demo-content-isolation.md).
 *
 * Archive pages after the first are listed; archives filtered by a tag are not, because they
 * are hidden from search engines (docs/adr/0011).
 */

export type SitemapContent = {
  articles: ArticleSummary[];
  twoPerspectives: TwoPerspectives[];
  authors: Author[];
  pages: Page[];
};

type SitemapEntry = MetadataRoute.Sitemap[number];

function latestDate(dates: string[]): string | undefined {
  return [...dates].sort().at(-1);
}

export function buildSitemap(content: SitemapContent, siteUrl: URL): MetadataRoute.Sitemap {
  const articles = content.articles.filter((article) => !article.isDemo);
  const twoPerspectives = content.twoPerspectives.filter((entry) => !entry.isDemo);

  function entry(path: string, lastModified?: string): SitemapEntry {
    return {
      url: toAbsoluteUrl(path, siteUrl),
      ...(lastModified !== undefined && { lastModified }),
    };
  }

  const articleDates = articles.map((article) => article.updatedAt ?? article.publishedAt);

  const categories = [...new Set<Category>(articles.map((article) => article.category))];
  const categoryEntries = categories.flatMap((category) => {
    const categoryArticles = articles.filter((article) => article.category === category);
    const lastPublishedAt = latestDate(categoryArticles.map((article) => article.publishedAt));
    const pageCount = countPages(categoryArticles.length, ARCHIVE_PAGE_SIZE);

    return Array.from({ length: pageCount }, (_, index) =>
      entry(
        getArchivePath({ category, tagSlug: null, pageNumber: index + 1 }),
        index === 0 ? lastPublishedAt : undefined,
      ),
    );
  });

  const tagPaths = [...new Set(articles.flatMap((article) => article.tags.map((tag) => tag.path)))];

  return [
    entry('/', latestDate(articleDates)),
    ...categoryEntries,
    ...(twoPerspectives.length > 0
      ? [entry('/duas-leituras', latestDate(twoPerspectives.map((item) => item.publishedAt)))]
      : []),
    ...twoPerspectives.map((item) => entry(item.path, item.publishedAt)),
    ...articles.map((article) => entry(article.path, article.updatedAt ?? article.publishedAt)),
    ...content.authors.map((author) => entry(author.path)),
    ...tagPaths.map((tagPath) => entry(tagPath)),
    ...content.pages.map((page) => entry(`/${page.slug}`)),
  ];
}
