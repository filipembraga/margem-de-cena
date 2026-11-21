import type { Metadata } from 'next';

import type { CategoryArchive } from '@/content';
import { getArchivePath } from '@/lib/archive-paths';
import { getCategoryDefinition } from '@/lib/categories';
import { buildPageMetadata } from '@/lib/seo';

/**
 * Metadata of an archive page: "Filmes", "Filmes · página 2", "Filmes · memória".
 * Filtered pages stay out of search engines: the tag page (`/tags/memoria`) already lists the
 * same articles across every category, and each article is linked from the unfiltered archive.
 */
export function buildArchiveMetadata(archive: CategoryArchive): Metadata {
  const { selection, selectedTag } = archive;
  const definition = getCategoryDefinition(selection.category);
  const titleParts = [
    definition.pluralLabel,
    ...(selectedTag ? [selectedTag.name] : []),
    ...(selection.pageNumber > 1 ? [`página ${selection.pageNumber}`] : []),
  ];

  return buildPageMetadata({
    title: titleParts.join(' · '),
    description: definition.description,
    path: getArchivePath(selection),
    isHiddenFromSearchEngines: selectedTag !== null,
  });
}
