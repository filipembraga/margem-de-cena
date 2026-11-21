# 0009. SEO metadata, structured data and generated share images

- Status: Accepted
- Date: 2026-11-20
- Amended: 2026-11-21 (Instagram post and Stories formats, breadcrumbs)

## Context

The brief asks for a unique title and description per page, canonical URLs, Open Graph
metadata, a sitemap, `robots.txt` and structured data for articles and authors. Instagram is
the main channel for sharing, so the image a shared link shows matters. There are no licensed
images yet, and the brief forbids scraped promotional material.

## Decision

- **One metadata builder.** Every page builds its metadata with `buildPageMetadata`
  (`src/lib/seo.ts`): title, description, canonical path, Open Graph and Twitter card.
  Next replaces a parent's `openGraph` instead of merging it, so the builder repeats the
  shared fields (site name, `pt_BR` locale) on every page.
- **Generated share images.** Share cards are rendered with `next/og` at build time, in the
  publication's typography: the site card (`src/app/opengraph-image.tsx`), one per article
  (category and work, title, authors, date) and one per Duas Leituras entry. Pages without a
  card of their own point to the site card explicitly. The favicon and the Apple touch icon
  are the "Mc" monogram, rendered the same way.
- **Instagram post format.** The brief asks for share images also suited to an Instagram post.
  The same card is rendered a second time at 1080 × 1350 (4:5, the tallest ratio a feed post
  keeps), as a static file next to each article and Duas Leituras entry:
  `/filmes/[slug]/instagram.png`. It is not declared in the page metadata, because link
  previews expect the wide format; the authors download it to post. A third format, for
  Instagram Stories (`/stories.png`, 1080 × 1920), backs the share bar's "Instagram" button
  (ADR 0012). All formats take their text from one function
  (`src/components/og/share-card-content.ts`), so they always match.
- **Fonts for the images.** `next/og` reads TTF, OTF or WOFF, not the WOFF2 files that
  `next/font` serves. The same families come from `@fontsource/cormorant-garamond` and
  `@fontsource/inter` (OFL), read from `node_modules` at build time.
- **Structured data.** JSON-LD for articles (`Article`, with the work as `about`: `Movie`,
  `Book` or `TVSeries`), author pages (`ProfilePage` with a `Person`) and the home page
  (`WebSite` with the search page as `SearchAction`). Articles, Duas Leituras entries and
  unfiltered category archives also carry a `BreadcrumbList` ("Início › Filmes › title"),
  which search engines may show in place of the URL. Author and tag pages have none, since
  there is no author or tag index to place them under. The builders are pure functions.
- **Sitemap and robots.** `sitemap.xml` lists the home page, the sections with content, Duas
  Leituras entries, articles, authors, tags and institutional pages. It drops demonstration
  entries explicitly, because preview builds load them, and a unit test guarantees it.
  `robots.txt` allows crawling only on the production deployment, matching the `robots` meta
  tag (ADR 0004).

## Consequences

- Every shared link shows a branded card, even for articles without an image, with no image
  licensing involved. The Instagram version needs no design work per post.
- Two small font packages are added; their files are only read at build time.
- Share cards in dynamic routes have hashed URLs, so the article JSON-LD lists a licensed
  cover as its `image` when there is one and omits the field otherwise.
- The base URL comes from `NEXT_PUBLIC_SITE_URL`. It must be set to the final domain before
  launch, or canonical URLs and the sitemap will point to the default.
