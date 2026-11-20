import { getArticleKicker } from '@/components/cards/article-card-data';
import type { ArticleSummary, Work } from '@/content';
import type { SearchDocument } from '@/lib/search';

function listWorkCreators(work: Work): string[] {
  switch (work.category) {
    case 'film':
      return work.directors;
    case 'book':
      return work.originalAuthors;
    case 'series':
      return work.creators;
  }
}

/** What the search index keeps of an article: enough to find it and to show it in a result. */
export function toSearchDocument(article: ArticleSummary): SearchDocument {
  const authorNames = article.authors.map((author) => author.name).join(' e ');
  const workText = article.work
    ? [article.work.title, article.work.originalTitle, ...listWorkCreators(article.work)]
        .filter((part) => part !== null)
        .join(' ')
    : '';

  return {
    path: article.path,
    title: article.title,
    kicker: getArticleKicker(article, { withWork: true }),
    excerpt: article.excerpt,
    authorNames,
    publishedAt: article.publishedAt,
    searchableFields: {
      work: workText,
      tags: article.tags.map((tag) => tag.name).join(' '),
      authors: authorNames,
      summary: [article.subtitle, article.excerpt].filter((part) => part !== null).join(' '),
    },
  };
}
