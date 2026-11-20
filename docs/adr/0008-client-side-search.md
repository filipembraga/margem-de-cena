# 0008. Search in the browser over an index built at build time

- Status: Accepted
- Date: 2026-11-20

## Context

The brief asks for search (`/busca`). The site is statically generated, has no server
runtime of its own and, at launch, a few dozen articles at most. Readers search for a title,
a work, an author or a theme, usually typing Portuguese words with or without accents.

Options considered:

- **A hosted search service** (Algolia and similar): excellent relevance, but an external
  account, a sync step and a third party receiving every query, for a catalogue this small.
- **A search library in the browser** (MiniSearch, FlexSearch, Fuse.js): fuzzy matching and
  scoring, at the cost of a dependency and its index format.
- **A small search function of our own** over a compact index.

## Decision

- The search page builds its index from the content catalog at build time: for each
  published article, its title, the work (title, original title, creators), tags, authors,
  subtitle and excerpt. Bodies are not indexed.
- The index travels inside the static `/busca` page. A client component normalizes it once
  and filters on every keystroke (`src/lib/search.ts`, pure and unit-tested).
- Matching ignores accents and case. Every word of the query must appear in the article.
  Results are ranked by where the words appear (title, then work, tags, authors, summary),
  then by date.
- The query lives in the URL (`/busca?q=memória`), so a search can be shared. The form is a
  plain `GET` form with `role="search"`, and the result count is announced in a live region.

## Consequences

- No dependency, no external service, and no reader query leaves the browser.
- The index only contains published content: it is built from the same catalog as the
  pages, and `verify:production-build` checks it for demonstration content.
- There is no fuzzy matching: a typo finds nothing. Searching inside article bodies is not
  supported.
- The index grows with the catalogue (about half a kilobyte per article). Past a few hundred
  articles it should move to a separate JSON file loaded on demand, or to a library such as
  MiniSearch; the page and the URL format can stay the same.
