import { ArticleList } from '@/components/cards/ArticleList';
import { PageHeader } from '@/components/layout/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildBreadcrumbStructuredData,
  HOME_BREADCRUMB,
  type BreadcrumbItem,
} from '@/components/seo/structured-data';
import { EmptyState } from '@/components/ui/EmptyState';
import type { CategoryArchive as CategoryArchiveData } from '@/content';
import { getArchivePath } from '@/lib/archive-paths';
import { getCategoryDefinition, getCategoryPath } from '@/lib/categories';
import { environment } from '@/lib/env';

import { ArchivePagination } from './ArchivePagination';
import { ArchiveTagFilter } from './ArchiveTagFilter';

/** A category archive page: header, tag filter, one page of cards and the page links. */
export function CategoryArchive({ archive }: { archive: CategoryArchiveData }) {
  const { selection, articles, pageCount, filterTags, selectedTag } = archive;
  const definition = getCategoryDefinition(selection.category);
  // Filtered archives are hidden from search engines, so only the unfiltered ones get a trail.
  const breadcrumbs: BreadcrumbItem[] | null =
    selectedTag === null
      ? [
          HOME_BREADCRUMB,
          { name: definition.pluralLabel, path: getCategoryPath(selection.category) },
          ...(selection.pageNumber > 1
            ? [{ name: `Página ${selection.pageNumber}`, path: getArchivePath(selection) }]
            : []),
        ]
      : null;

  return (
    <div className="page-container pb-22">
      {breadcrumbs && (
        <JsonLd data={buildBreadcrumbStructuredData(breadcrumbs, environment.siteUrl)} />
      )}
      <PageHeader title={definition.pluralLabel} description={definition.description} />

      {filterTags.length > 0 && (
        <div className="pt-10">
          <ArchiveTagFilter
            category={selection.category}
            tags={filterTags}
            selectedTag={selectedTag}
          />
        </div>
      )}

      <div className="pt-12">
        {articles.length > 0 ? (
          <ArticleList
            articles={articles}
            layout={selection.category === 'essay' ? 'numbered' : 'grid'}
            firstPosition={archive.firstArticlePosition}
          />
        ) : (
          <EmptyState
            title="Por enquanto, nada publicado nesta seção."
            description="Os textos aparecem aqui assim que forem publicados."
          />
        )}
        <ArchivePagination selection={selection} pageCount={pageCount} />
      </div>
    </div>
  );
}
