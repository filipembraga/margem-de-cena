import type { TagReference } from '@/content';
import { TagChip } from '@/components/ui/TagChip';
import { getArchivePath } from '@/lib/archive-paths';
import type { Category } from '@/lib/categories';

type ArchiveTagFilterProps = {
  category: Category;
  tags: TagReference[];
  selectedTag: TagReference | null;
};

/**
 * Tag chips above an archive: "Todas" and the tags most used in the category. Each chip is a
 * link to the filtered archive (`/filmes/etiqueta/memoria`), and the current one is marked
 * with `aria-current`.
 */
export function ArchiveTagFilter({ category, tags, selectedTag }: ArchiveTagFilterProps) {
  return (
    <nav aria-label="Filtrar por etiqueta" className="flex flex-col gap-3">
      <p className="type-label text-muted">Etiquetas</p>
      <ul className="flex flex-wrap gap-2.5">
        <li>
          <TagChip
            name="Todas"
            href={getArchivePath({ category, tagSlug: null, pageNumber: 1 })}
            isCurrent={selectedTag === null}
          />
        </li>
        {tags.map((tag) => (
          <li key={tag.slug}>
            <TagChip
              name={tag.name}
              href={getArchivePath({ category, tagSlug: tag.slug, pageNumber: 1 })}
              isCurrent={tag.slug === selectedTag?.slug}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
