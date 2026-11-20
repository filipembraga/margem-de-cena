import { slugify } from '@/lib/slug';

import type { ContentIssue } from './issues';
import type { ParsedArticle, ParsedContent, ParsedRecord } from './parse';
import type { WorkData } from './schemas';
import { MAXIMUM_TAGS_PER_ARTICLE } from './tags';
import type { PageSlug } from './types';

/**
 * Second stage of the pipeline: rules that involve more than one record. Every rule adds
 * issues instead of throwing, so the build reports all problems at once.
 * The rules are listed in docs/adr/0002-file-based-content-layer.md.
 */

export const REQUIRED_PAGES: readonly PageSlug[] = ['sobre', 'contato', 'privacidade', 'creditos'];

type IssueReporter = (origin: string, message: string) => void;

export function checkIntegrity(content: ParsedContent): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const report: IssueReporter = (origin, message) => issues.push({ origin, message });

  checkUniqueSlugs(content, report);
  checkDemoPlacement(content, report);
  checkDates(content.articles, report);
  checkArticleAuthors(content, report);
  checkArticleWorks(content, report);
  checkFeatured(content.articles, report);
  checkTags(content.articles, report);
  checkTwoPerspectives(content, report);
  checkPages(content, report);

  return issues;
}

/** Slugs identify articles everywhere (URLs, and later likes and comments), demo included. */
function checkUniqueSlugs(content: ParsedContent, report: IssueReporter): void {
  const collections: Array<{ label: string; records: ParsedRecord<unknown>[] }> = [
    { label: 'texto', records: content.articles },
    { label: 'obra', records: content.works },
    { label: 'entrada de Duas Leituras', records: content.twoPerspectives },
  ];

  for (const { label, records } of collections) {
    const originsBySlug = new Map<string, string>();
    for (const { record } of records) {
      const firstOrigin = originsBySlug.get(record.slug);
      if (firstOrigin) {
        report(record.origin, `Já existe ${label} com o slug "${record.slug}" em ${firstOrigin}.`);
      } else {
        originsBySlug.set(record.slug, record.origin);
      }
    }
  }
}

/** Demo entries live only in `content/demo/`, and only they may use `status: demo`. */
function checkDemoPlacement(content: ParsedContent, report: IssueReporter): void {
  for (const { record, data } of content.articles) {
    const hasDemoStatus = data.status === 'demo';
    if (record.isDemo && !hasDemoStatus) {
      report(record.origin, 'Textos em content/demo/ devem ter "status: demo".');
    }
    if (!record.isDemo && hasDemoStatus) {
      report(record.origin, '"status: demo" só é permitido em content/demo/.');
    }
  }
}

function checkDates(articles: ParsedArticle[], report: IssueReporter): void {
  for (const { record, data } of articles) {
    if (data.status !== 'draft' && !data.publishedAt) {
      report(record.origin, 'publishedAt: obrigatório para textos publicados ou de demonstração.');
    }
    if (data.publishedAt && data.updatedAt && data.updatedAt < data.publishedAt) {
      report(record.origin, 'updatedAt: não pode ser anterior a publishedAt.');
    }
  }
}

function checkArticleAuthors(content: ParsedContent, report: IssueReporter): void {
  const authorSlugs = new Set(content.authors.map(({ record }) => record.slug));

  for (const { record, data } of content.articles) {
    for (const authorSlug of data.authors) {
      if (!authorSlugs.has(authorSlug)) {
        report(record.origin, `authors: autor "${authorSlug}" não existe em content/authors/.`);
      }
    }
    if (new Set(data.authors).size !== data.authors.length) {
      report(record.origin, 'authors: o mesmo autor aparece duas vezes.');
    }
  }
}

function checkArticleWorks(content: ParsedContent, report: IssueReporter): void {
  const worksBySlug = new Map(content.works.map((work) => [work.record.slug, work]));

  for (const { record, data } of content.articles) {
    if (!data.work) {
      continue;
    }
    if (data.category === 'essay') {
      report(record.origin, 'work: ensaios não se referem a uma obra específica.');
      continue;
    }

    const work = worksBySlug.get(data.work);
    if (!work) {
      report(record.origin, `work: obra "${data.work}" não existe em content/works/.`);
      continue;
    }
    if (work.data.category !== data.category) {
      report(
        record.origin,
        `work: a obra "${data.work}" é da categoria "${work.data.category}", mas o texto é "${data.category}".`,
      );
    }
    if (work.record.isDemo && !record.isDemo) {
      report(record.origin, `work: a obra "${data.work}" é de demonstração.`);
    }
  }
}

/** The home page has one hero; demo content may have its own while it is shown. */
function checkFeatured(articles: ParsedArticle[], report: IssueReporter): void {
  for (const status of ['published', 'demo'] as const) {
    const featured = articles.filter(({ data }) => data.featured && data.status === status);
    for (const extraArticle of featured.slice(1)) {
      report(
        extraArticle.record.origin,
        `featured: só um texto pode estar em destaque (já está: ${featured[0]?.record.origin}).`,
      );
    }
  }
}

/** One canonical spelling per tag across the whole publication. */
function checkTags(articles: ParsedArticle[], report: IssueReporter): void {
  const firstSpellingBySlug = new Map<string, { name: string; origin: string }>();

  for (const { record, body, data, tags } of articles) {
    if (tags.length > MAXIMUM_TAGS_PER_ARTICLE) {
      report(
        record.origin,
        `Etiquetas demais (${tags.length}). O limite é ${MAXIMUM_TAGS_PER_ARTICLE} por texto.`,
      );
    }

    for (const name of [...body.tagMentions, ...data.tags]) {
      const slug = slugify(name);
      if (slug === '') {
        report(record.origin, `Etiqueta "${name}" não tem letras ou números.`);
        continue;
      }

      const firstSpelling = firstSpellingBySlug.get(slug);
      if (!firstSpelling) {
        firstSpellingBySlug.set(slug, { name, origin: record.origin });
      } else if (firstSpelling.name !== name) {
        report(
          record.origin,
          `Etiqueta "${name}" tem outra grafia em ${firstSpelling.origin}: "${firstSpelling.name}". ` +
            'Use sempre a mesma.',
        );
      }
    }
  }
}

/**
 * A Duas Leituras entry: one work, exactly two articles about it, each by a single and
 * different author, both visible in the same way (both published, or both demo).
 */
function checkTwoPerspectives(content: ParsedContent, report: IssueReporter): void {
  const articlesBySlug = new Map(content.articles.map((article) => [article.record.slug, article]));
  const worksBySlug = new Map<string, ParsedRecord<WorkData>>(
    content.works.map((work) => [work.record.slug, work]),
  );
  const entryOriginByArticleSlug = new Map<string, string>();

  for (const { record, data } of content.twoPerspectives) {
    if (!worksBySlug.has(data.work)) {
      report(record.origin, `work: obra "${data.work}" não existe em content/works/.`);
    }

    const [firstSlug, secondSlug] = data.articles;
    if (firstSlug === secondSlug) {
      report(record.origin, 'articles: os dois textos precisam ser diferentes.');
      continue;
    }

    const expectedStatus = record.isDemo ? 'demo' : 'published';
    const articles: ParsedArticle[] = [];

    for (const articleSlug of data.articles) {
      const article = articlesBySlug.get(articleSlug);
      if (!article) {
        report(record.origin, `articles: texto "${articleSlug}" não existe.`);
        continue;
      }
      articles.push(article);

      if (article.data.work !== data.work) {
        report(
          record.origin,
          `articles: o texto "${articleSlug}" não se refere à obra "${data.work}".`,
        );
      }
      if (article.data.authors.length !== 1) {
        report(record.origin, `articles: o texto "${articleSlug}" deve ter um único autor.`);
      }
      if (article.data.status !== expectedStatus) {
        report(
          record.origin,
          `articles: o texto "${articleSlug}" deve ter "status: ${expectedStatus}" ` +
            '(as duas leituras entram no ar juntas).',
        );
      }

      const otherEntryOrigin = entryOriginByArticleSlug.get(articleSlug);
      if (otherEntryOrigin) {
        report(record.origin, `articles: o texto "${articleSlug}" já está em ${otherEntryOrigin}.`);
      } else {
        entryOriginByArticleSlug.set(articleSlug, record.origin);
      }
    }

    const [firstArticle, secondArticle] = articles;
    if (
      firstArticle &&
      secondArticle &&
      firstArticle.data.authors[0] === secondArticle.data.authors[0]
    ) {
      report(record.origin, 'articles: as duas leituras devem ser de autores diferentes.');
    }
  }
}

function checkPages(content: ParsedContent, report: IssueReporter): void {
  const pageSlugs = new Set(content.pages.map(({ record }) => record.slug));

  for (const { record } of content.pages) {
    if (!REQUIRED_PAGES.includes(record.slug as PageSlug)) {
      report(record.origin, `Página desconhecida. Páginas aceitas: ${REQUIRED_PAGES.join(', ')}.`);
    }
  }
  for (const requiredSlug of REQUIRED_PAGES) {
    if (!pageSlugs.has(requiredSlug)) {
      report(`content/pages/${requiredSlug}.mdx`, 'Página obrigatória ausente.');
    }
  }
}
