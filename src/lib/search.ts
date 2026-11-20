/**
 * Search over the published articles, in the browser (docs/adr/0008-client-side-search.md).
 * Pure functions: the search page prepares the index once and runs a query per keystroke.
 *
 * Matching ignores accents and case ("memoria" finds "Memória"). Every word of the query must
 * appear somewhere in the article; where it appears decides the ranking.
 */

/** One article as the search index stores it. */
export type SearchDocument = {
  path: string;
  title: string;
  /** "Filmes · A casa das marés" */
  kicker: string;
  excerpt: string;
  /** "Filipe Braga e Adriana Guimarães" */
  authorNames: string;
  publishedAt: string;
  /** Text searched besides the title, grouped by how much a match there counts. */
  searchableFields: {
    /** Title, original title and creators of the work. */
    work: string;
    tags: string;
    authors: string;
    /** Subtitle and excerpt. */
    summary: string;
  };
};

type FieldName = 'title' | keyof SearchDocument['searchableFields'];

/** A match in the title counts most; a match in the summary counts least. */
const FIELD_WEIGHTS: Record<FieldName, number> = {
  title: 5,
  work: 4,
  tags: 3,
  authors: 2,
  summary: 1,
};

const FIELD_NAMES = Object.keys(FIELD_WEIGHTS) as FieldName[];

export type PreparedSearchDocument = {
  document: SearchDocument;
  normalizedFields: Record<FieldName, string>;
};

/** Lowercase, without accents and with single spaces: "  Memória " → "memoria". */
export function normalizeForSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Normalizes every field once, so each query only compares strings. */
export function prepareSearchIndex(documents: SearchDocument[]): PreparedSearchDocument[] {
  return documents.map((document) => ({
    document,
    normalizedFields: {
      title: normalizeForSearch(document.title),
      work: normalizeForSearch(document.searchableFields.work),
      tags: normalizeForSearch(document.searchableFields.tags),
      authors: normalizeForSearch(document.searchableFields.authors),
      summary: normalizeForSearch(document.searchableFields.summary),
    },
  }));
}

/** The weight of the most important field that contains the term, or 0 when none does. */
function scoreTerm(normalizedFields: Record<FieldName, string>, term: string): number {
  const matchingWeights = FIELD_NAMES.filter((fieldName) =>
    normalizedFields[fieldName].includes(term),
  ).map((fieldName) => FIELD_WEIGHTS[fieldName]);

  return Math.max(0, ...matchingWeights);
}

/**
 * Articles that contain every word of the query, best matches first; equally good matches
 * are ordered most recent first. An empty query returns nothing.
 */
export function searchDocuments(index: PreparedSearchDocument[], query: string): SearchDocument[] {
  const terms = normalizeForSearch(query)
    .split(' ')
    .filter((term) => term !== '');
  if (terms.length === 0) {
    return [];
  }

  const matches: Array<{ document: SearchDocument; score: number }> = [];
  for (const { document, normalizedFields } of index) {
    const termScores = terms.map((term) => scoreTerm(normalizedFields, term));
    if (termScores.every((score) => score > 0)) {
      const totalScore = termScores.reduce((total, score) => total + score, 0);
      matches.push({ document, score: totalScore });
    }
  }

  return matches
    .sort(
      (first, second) =>
        second.score - first.score ||
        second.document.publishedAt.localeCompare(first.document.publishedAt),
    )
    .map(({ document }) => document);
}
