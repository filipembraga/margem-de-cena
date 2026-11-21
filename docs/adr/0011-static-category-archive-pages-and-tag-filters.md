# 0011. Static category archive pages and tag filters

- Status: Accepted
- Date: 2026-11-21

## Context

The brief (§5.2) asks for category archives that support filtering and pagination or
progressive loading. The site is statically generated (ADR 0001), has no server to answer
query strings, and must work without JavaScript. Tags already have their own pages across
all categories (`/tags/memoria`, ADR 0007).

## Decision

- **Every archive page is a static URL**, generated at build time:
  - `/filmes`: the first page;
  - `/filmes/pagina/2`: later pages;
  - `/filmes/etiqueta/memoria`: the archive filtered by a tag;
  - `/filmes/etiqueta/memoria/pagina/2`: later pages of that filter.
  The four routes share one component (`CategoryArchive`) and one loader (`readArchive`);
  the content layer answers with `getCategoryArchive` and lists the pages to generate with
  `getArchiveSelections`.
- **Pagination**, not progressive loading: twelve articles per page (four rows of three
  cards), with "Anterior", the page numbers and "Próxima". Pages work without JavaScript,
  can be linked, and keep the essay numbering across pages. The first page has no page
  segment, and `/filmes/pagina/1` is a 404, so each page has one URL.
- **Tag filter:** the tags most used in the category (up to twelve, most used first) as
  chips, plus "Todas". It is hidden in a category with fewer than two articles, where it
  would filter nothing. Only these tags get filtered pages.
- **Search engines:** later pages are indexed and listed in the sitemap. Filtered pages are
  `noindex` and stay out of the sitemap: the tag page already lists the same articles, and
  each article is linked from the unfiltered archive.
- **Reserved slugs:** `pagina` and `etiqueta` are URL segments of the archive, so the content
  validation rejects an article with either slug.

## Consequences

- The number of generated pages grows with categories × tags × pages. With the expected
  volume (a few dozen articles per category) this is a few hundred small HTML files.
- Filtering by more than one tag at a time is not possible. If readers need it, a
  client-side filter over the archive's article list can be added without changing these URLs.
- Changing `ARCHIVE_PAGE_SIZE` changes which page each article falls on. That is expected for
  archives and does not affect article URLs.
