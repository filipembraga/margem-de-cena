import type { Work } from '@/content';

export type WorkFact = {
  label: string;
  value: string;
};

function joinNames(names: string[]): string {
  return new Intl.ListFormat('pt-BR', { type: 'conjunction' }).format(names);
}

/**
 * The facts shown in the work info box ("Ficha da obra"), in display order. Only fields that
 * exist are returned, so the box never shows empty rows.
 */
export function getWorkFacts(work: Work): WorkFact[] {
  const facts: Array<WorkFact | null> = [
    { label: 'Título', value: work.title },
    work.originalTitle ? { label: 'Título original', value: work.originalTitle } : null,
  ];

  switch (work.category) {
    case 'film':
      facts.push(
        work.directors.length > 0 ? { label: 'Direção', value: joinNames(work.directors) } : null,
        work.year ? { label: 'Ano', value: String(work.year) } : null,
        work.runtimeInMinutes ? { label: 'Duração', value: `${work.runtimeInMinutes} min` } : null,
      );
      break;
    case 'book':
      facts.push(
        work.originalAuthors.length > 0
          ? { label: 'Autoria', value: joinNames(work.originalAuthors) }
          : null,
        work.year ? { label: 'Publicação original', value: String(work.year) } : null,
        work.publisher ? { label: 'Editora', value: work.publisher } : null,
        work.translator ? { label: 'Tradução', value: work.translator } : null,
        work.edition ? { label: 'Edição', value: work.edition } : null,
      );
      break;
    case 'series':
      facts.push(
        work.creators.length > 0 ? { label: 'Criação', value: joinNames(work.creators) } : null,
        work.year ? { label: 'Ano', value: String(work.year) } : null,
        work.platform ? { label: 'Plataforma', value: work.platform } : null,
        work.seasons ? { label: 'Temporadas', value: String(work.seasons) } : null,
      );
      break;
  }

  return facts.filter((fact) => fact !== null);
}

/** One line under a work title: "2025 · direção de [Nome] · 112 min". */
export function getWorkSummaryLine(work: Work): string {
  const parts: Array<string | null> = [work.year ? String(work.year) : null];

  switch (work.category) {
    case 'film':
      parts.push(
        work.directors.length > 0 ? `direção de ${joinNames(work.directors)}` : null,
        work.runtimeInMinutes ? `${work.runtimeInMinutes} min` : null,
      );
      break;
    case 'book':
      parts.push(
        work.originalAuthors.length > 0 ? joinNames(work.originalAuthors) : null,
        work.genre,
      );
      break;
    case 'series':
      parts.push(
        work.creators.length > 0 ? `criação de ${joinNames(work.creators)}` : null,
        work.platform,
      );
      break;
  }

  return parts.filter((part) => part !== null).join(' · ');
}
