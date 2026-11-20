import type { Metadata } from 'next';
import { Suspense } from 'react';

import { PageHeader } from '@/components/layout/PageHeader';
import { toSearchDocument } from '@/components/search/search-document';
import { SearchView, SearchViewWithUrlQuery } from '@/components/search/SearchView';
import { TagChip } from '@/components/ui/TagChip';
import { getPublishedArticles, getTags, type TagReference } from '@/content';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Busca',
  description: 'Busque textos da Margem de Cena por título, obra, autoria ou etiqueta.',
  path: '/busca',
});

/**
 * Search over every published article. The index is built at build time and travels with
 * the page; the browser does the matching (docs/adr/0008-client-side-search.md).
 */
export default async function SearchPage() {
  const [articles, tags] = await Promise.all([getPublishedArticles(), getTags()]);
  const documents = articles.map(toSearchDocument);
  const browseSuggestions = <TagList tags={tags} />;

  return (
    <div className="page-container pb-22">
      <PageHeader title="Busca" />
      <div className="max-w-230 pt-10">
        {/* The query comes from the URL, which a static page only knows in the browser. */}
        <Suspense fallback={<SearchView documents={[]} browseSuggestions={browseSuggestions} />}>
          <SearchViewWithUrlQuery documents={documents} browseSuggestions={browseSuggestions} />
        </Suspense>
      </div>
    </div>
  );
}

function TagList({ tags }: { tags: TagReference[] }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="etiquetas" className="flex flex-col gap-5">
      <h2 id="etiquetas" className="type-label">
        Ou navegue pelas etiquetas
      </h2>
      <ul className="flex flex-wrap gap-2.5">
        {tags.map((tag) => (
          <li key={tag.slug}>
            <TagChip name={tag.name} />
          </li>
        ))}
      </ul>
    </section>
  );
}
