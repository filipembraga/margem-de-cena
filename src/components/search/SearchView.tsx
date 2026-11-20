'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useId, useMemo, useState, type ReactNode } from 'react';

import { EmptyState } from '@/components/ui/EmptyState';
import { Kicker } from '@/components/ui/Kicker';
import { formatShortDate, toDateTimeAttribute } from '@/lib/dates';
import { prepareSearchIndex, searchDocuments, type SearchDocument } from '@/lib/search';

/** The URL parameter that holds the query, so a search can be shared or bookmarked. */
export const SEARCH_QUERY_PARAMETER = 'q';

type SearchViewProps = {
  documents: SearchDocument[];
  /** Shown while the field is empty, as a way to browse (the tag list). */
  browseSuggestions: ReactNode;
};

/**
 * The search view with the query read from the URL (`/busca?q=memória`), so a search can be
 * shared. Reading the URL suspends a static page until it reaches the browser, so the page
 * wraps this in `<Suspense>` with `SearchView` as the fallback.
 */
export function SearchViewWithUrlQuery(props: SearchViewProps) {
  const initialQuery = useSearchParams().get(SEARCH_QUERY_PARAMETER) ?? '';
  return <SearchView {...props} initialQuery={initialQuery} />;
}

/**
 * The search field and its results, updated as the reader types and mirrored in the URL.
 * Without JavaScript the form still submits to the same address.
 */
export function SearchView({
  documents,
  browseSuggestions,
  initialQuery = '',
}: SearchViewProps & { initialQuery?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const inputId = useId();

  const index = useMemo(() => prepareSearchIndex(documents), [documents]);
  const results = useMemo(() => searchDocuments(index, query), [index, query]);
  const trimmedQuery = query.trim();

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);
    const parameters = new URLSearchParams();
    if (nextQuery.trim() !== '') {
      parameters.set(SEARCH_QUERY_PARAMETER, nextQuery);
    }
    const queryString = parameters.toString();
    router.replace(queryString === '' ? pathname : `${pathname}?${queryString}`, {
      scroll: false,
    });
  }

  return (
    <div className="flex flex-col gap-10">
      <form
        role="search"
        action={pathname}
        method="get"
        onSubmit={(event) => event.preventDefault()}
        className="flex flex-col gap-2"
      >
        <label htmlFor={inputId} className="type-label">
          Buscar por título, obra, autoria ou etiqueta
        </label>
        <input
          id={inputId}
          type="search"
          name={SEARCH_QUERY_PARAMETER}
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          autoComplete="off"
          enterKeyHint="search"
          className="min-h-14 w-full border-0 border-b border-fg bg-transparent px-0 py-2 font-display text-[1.75rem] text-fg placeholder:text-muted sm:text-[2.25rem]"
          placeholder="memória, A casa das marés…"
        />
      </form>

      <p role="status" className="type-meta text-muted">
        {trimmedQuery !== '' && describeResultCount(results.length, trimmedQuery)}
      </p>

      {trimmedQuery === '' && browseSuggestions}

      {trimmedQuery !== '' && results.length === 0 && (
        <EmptyState
          title={`Nenhum resultado para “${trimmedQuery}”.`}
          description="Tente outra palavra, o nome de uma obra ou de quem escreve."
        />
      )}

      {results.length > 0 && (
        <ol className="flex flex-col">
          {results.map((document) => (
            <li key={document.path}>
              <SearchResult document={document} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function describeResultCount(count: number, query: string): string {
  if (count === 0) {
    return '';
  }
  const countLabel = count === 1 ? '1 texto encontrado' : `${count} textos encontrados`;
  return `${countLabel} para “${query}”.`;
}

function SearchResult({ document }: { document: SearchDocument }) {
  return (
    <article className="flex flex-col gap-2 border-t border-line py-6">
      <Kicker>{document.kicker}</Kicker>
      <h2 className="type-card-title">
        <Link href={document.path} className="hover:text-accent">
          {document.title}
        </Link>
      </h2>
      <p className="max-w-170 type-excerpt text-fg-soft">{document.excerpt}</p>
      <p className="type-meta-small text-muted">
        {document.authorNames} ·{' '}
        <time dateTime={toDateTimeAttribute(document.publishedAt)}>
          {formatShortDate(document.publishedAt)}
        </time>
      </p>
    </article>
  );
}
