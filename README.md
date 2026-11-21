# Margem de Cena

> Publicação cultural independente sobre cinema, literatura e televisão.

The website of Margem de Cena, an independent Brazilian publication written by Filipe Braga and
Adriana Guimarães: long-form texts about films, books and series, and **Duas Leituras**, two
independent readings of the same work.

Built with Next.js (App Router, static generation), TypeScript, Tailwind CSS v4 and content
stored in the repository as MDX and YAML.

## Getting started

Requirements: Node.js 26 (see `.nvmrc`) and pnpm 12 (pinned in `package.json#packageManager`).

```sh
pnpm install
SHOW_DEMO_CONTENT=true pnpm dev
```

Open http://localhost:3000. With demo content enabled, the styleguide is at
http://localhost:3000/styleguide.

### Environment variables

| Variable               | Default                 | Purpose                                                                                                       |
| ---------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public base URL for canonical URLs, Open Graph, structured data and the sitemap. Set it to the final domain in production. |
| `SHOW_DEMO_CONTENT`    | `false`                 | Shows demonstration content and the styleguide (`/styleguide`). Local and Vercel Preview only; the build fails if it is `true` in production. |

## Scripts

| Command                     | What it does                                                       |
| --------------------------- | ------------------------------------------------------------------ |
| `pnpm dev`                  | Development server                                                 |
| `pnpm build` / `pnpm start` | Production build and server                                        |
| `pnpm check`                | Typecheck, lint, unit tests and the no-drafts check (run before every commit proposal) |
| `pnpm test`                 | Unit tests (Vitest)                                                |
| `pnpm test:e2e`             | Smoke and accessibility tests (Playwright + axe) on a production build with demo content |
| `pnpm format`               | Format with Prettier                                               |
| `pnpm verify:production-build` | After `pnpm build` without demo content, fails if demo content reached any page, the search index or the sitemap |
| `pnpm check:placeholders`   | Lists the `[A PREENCHER: …]` texts still to be written; `--strict` fails while any is left |

The first end-to-end run needs a browser: `pnpm exec playwright install chromium`.

## Project structure

```
content/          articles, authors, works, Duas Leituras and pages (MDX + YAML)
content/demo/     demonstration entries, read only when SHOW_DEMO_CONTENT=true
src/app/          routes (thin: query the content layer, compose components)
src/components/   presentational components (layout, ui, cards, article, mdx, home, search,
                  seo for metadata helpers and structured data, og for share images)
src/content/      content layer: the only code that reads files
src/lib/          pure utilities: categories, dates, slugs, search, SEO metadata, environment,
                  theme, site config
scripts/          repository checks (no committed drafts, no demo in production builds)
tests/            end-to-end and accessibility tests
docs/             brief, design system, ADRs, conventions and the writers' guide
```

## Documentation

- [Product brief](docs/briefing.md)
- [Design system](docs/design-system.md)
- [Architecture decision records](docs/adr/)
- [Engineering conventions](docs/engineering-conventions.md)
- [Como publicar](docs/como-publicar.md): the writers' guide (pt-BR)

## Content layer

Content goes through one pipeline, so every problem in every file is reported together and
fails the build ([ADR 0002](docs/adr/0002-file-based-content-layer.md)):

```
ContentSource -> parse (Zod schemas, MDX) -> integrity checks -> image sizes -> ContentCatalog
(filesystem)                                                                    -> queries
```

Pages import query functions from `src/content` (`getPublishedArticles`, `getArticle`,
`getTwoPerspectives`, ...) and receive domain types, never raw frontmatter. A headless CMS
would implement `ContentSource` and reuse everything after it.

## Search, SEO and sharing

- **Search** (`/busca`) runs in the browser over an index built at build time, ignoring
  accents and case ([ADR 0008](docs/adr/0008-client-side-search.md)).
- **Every page** declares a title, description, canonical URL, Open Graph and Twitter card
  through `buildPageMetadata` ([ADR 0009](docs/adr/0009-seo-metadata-and-open-graph-images.md)).
- **Share images** for the site, each article and each Duas Leituras entry are generated with
  `next/og` at build time, as are the favicon and the Apple touch icon.
- **Structured data** (JSON-LD) describes articles, author pages and the site.
- **`sitemap.xml` and `robots.txt`** are generated from the catalog; only the production
  deployment is open to crawlers, and the sitemap never lists demonstration content.

## Workflow

Work happens in stages, one branch and pull request per stage, with Conventional Commits.
commitlint also rejects AI attribution in commit messages, in the commit-msg hook and again
in CI.
Each pull request description is the stage report. CI runs typecheck, lint, formatting, unit
tests, a production build and the end-to-end suite on every pull request
([ADR 0006](docs/adr/0006-quality-gates-and-branch-workflow.md)).
