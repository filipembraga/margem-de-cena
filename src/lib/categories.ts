/**
 * The single place that maps editorial categories to their pt-BR labels and URL slugs.
 * Never hardcode a category label or slug anywhere else.
 */

export const CATEGORIES = ['film', 'book', 'series', 'essay'] as const;

export type Category = (typeof CATEGORIES)[number];

export type CategoryDefinition = {
  /** Singular label, e.g. "Duas Leituras · Filme". */
  singularLabel: string;
  /** Plural label, used for section names, navigation and kickers. */
  pluralLabel: string;
  /** URL segment, e.g. `/filmes`. */
  slug: string;
};

const CATEGORY_DEFINITIONS: Record<Category, CategoryDefinition> = {
  film: { singularLabel: 'Filme', pluralLabel: 'Filmes', slug: 'filmes' },
  book: { singularLabel: 'Livro', pluralLabel: 'Livros', slug: 'livros' },
  series: { singularLabel: 'Série', pluralLabel: 'Séries', slug: 'series' },
  essay: { singularLabel: 'Ensaio', pluralLabel: 'Ensaios', slug: 'ensaios' },
};

/** Returns the labels and slug of a category. */
export function getCategoryDefinition(category: Category): CategoryDefinition {
  return CATEGORY_DEFINITIONS[category];
}

/** Finds the category whose URL slug matches, or `undefined` for an unknown slug. */
export function findCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((category) => CATEGORY_DEFINITIONS[category].slug === slug);
}

/** Path of a category archive, e.g. `/filmes`. */
export function getCategoryPath(category: Category): string {
  return `/${CATEGORY_DEFINITIONS[category].slug}`;
}

/** Path of an article inside its category, e.g. `/filmes/a-mare-que-nao-volta`. */
export function getArticlePath(category: Category, articleSlug: string): string {
  return `${getCategoryPath(category)}/${articleSlug}`;
}
