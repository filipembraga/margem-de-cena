/**
 * The single place that maps editorial categories to their pt-BR labels and URL slugs.
 * Never hardcode a category label or slug anywhere else.
 */

export const CATEGORIES = ['film', 'book', 'series', 'essay'] as const;

export type Category = (typeof CATEGORIES)[number];

/** A part of the site that lists content; while it has none, it is hidden. */
export type ContentSection = Category | 'two-perspectives';

export type CategoryDefinition = {
  /** Singular label, e.g. "Duas Leituras · Filme". */
  singularLabel: string;
  /** Plural label, used for section names, navigation and kickers. */
  pluralLabel: string;
  /** URL segment, e.g. `/filmes`. */
  slug: string;
  /** One line under the archive title. */
  description: string;
};

const CATEGORY_DEFINITIONS: Record<Category, CategoryDefinition> = {
  film: {
    singularLabel: 'Filme',
    pluralLabel: 'Filmes',
    slug: 'filmes',
    description: 'Leituras de filmes, recentes ou não, escritas com tempo.',
  },
  book: {
    singularLabel: 'Livro',
    pluralLabel: 'Livros',
    slug: 'livros',
    description: 'Leituras de romances, contos, poesia e o que mais couber numa estante.',
  },
  series: {
    singularLabel: 'Série',
    pluralLabel: 'Séries',
    slug: 'series',
    description: 'Leituras de séries e minisséries, temporada a temporada.',
  },
  essay: {
    singularLabel: 'Ensaio',
    pluralLabel: 'Ensaios',
    slug: 'ensaios',
    description: 'Textos longos e temáticos, que atravessam obras, gêneros e épocas.',
  },
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
