import type { TwoPerspectives, Work } from '@/content';
import { getCategoryDefinition } from '@/lib/categories';

/** Roman numerals of the two readings, as in "Leitura I". */
export const PERSPECTIVE_NUMERALS = { 1: 'I', 2: 'II' } as const;

export const PERSPECTIVE_ORDINALS = { 1: 'Primeira leitura', 2: 'Segunda leitura' } as const;

/** "Livro · romance · 2019" */
export function getWorkCategoryLine(work: Work): string {
  return [getCategoryDefinition(work.category).singularLabel, work.genre, work.year]
    .filter((part) => part !== null)
    .join(' · ');
}

/** "Filipe Braga e Adriana Guimarães" */
export function getPerspectiveAuthorNames(entry: TwoPerspectives): string {
  return entry.perspectives
    .flatMap(({ article }) => article.authors.map((author) => author.name))
    .join(' e ');
}
