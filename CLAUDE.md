# Margem de Cena

Independent Brazilian cultural publication about cinema, literature and television,
written by Filipe Braga and Adriana Guimarães. This repository is the publication's
website. It is also a portfolio piece, so code quality, history and documentation matter
as much as the visual result.

- Product brief: `docs/briefing.md`
- Design system (source of truth for every visual decision): `docs/design-system.md`
- Approved mockups: `docs/design/screens/*.png` (images) and `docs/design/reference/*.dc.html`
  (markup reference only: read it for exact spacing and type values; it is not runnable code
  and must not be copied into the app)
- Architecture decisions: `docs/adr/`
- Engineering conventions (naming, readability, code style): `docs/engineering-conventions.md`
- Writers' guide (pt-BR, created in Stage 3): `docs/como-publicar.md`

## Working agreement (read first, always applies)

1. **Work in stages.** The current stage is defined by the prompt. Finish it, then stop and
   report: what changed, how to verify it (commands and URLs), assumptions, open questions.
   Wait for approval before starting anything outside the stage.
2. **Filipe approves every commit.** Never run `git commit`, `git push`, `git rebase`,
   `git reset`, branch deletion or PR creation unless he explicitly asks in the current
   conversation. When work is ready, propose the commit plan (message + files per commit)
   and wait.
3. **Commit messages** follow Conventional Commits, in English, imperative mood, small and
   atomic (`feat(article): add spoiler reveal component`). Messages contain no AI attribution
   of any kind: no `Co-Authored-By` trailer, no "Generated with" line, no tool names. The
   author is the repository's configured git user.
4. **Branches:** `main` is always deployable. One branch per stage or feature
   (`feat/visual-foundation`, `feat/content-layer`, `fix/...`), merged through a PR.
5. **Decisions:** any significant technical choice (library, data model, rendering strategy)
   gets a short ADR in `docs/adr/NNNN-kebab-title.md` (Context, Decision, Consequences).
6. **Dependencies:** add only what is justified. State each new dependency and why in the
   stage report. Prefer platform features and small, well-maintained packages; check that a
   package is actively maintained before choosing it.
7. **Ask only when blocked.** Otherwise pick the sensible default and list it as an assumption.
8. **Before proposing a commit,** `pnpm check` must pass (typecheck, lint, unit tests), and
   `pnpm build` must pass when routes, config or content code changed.

## Language

- Engineering is in **English**: code, identifiers, comments, commit messages, branch names,
  PRs, README, ADRs, technical docs, frontmatter and data **keys**.
- The product is in **Brazilian Portuguese (pt-BR)**: everything a reader of the site sees
  (UI copy, alt text, aria-labels, metadata, error and empty states), article content,
  frontmatter **values**, and URL slugs. `<html lang="pt-BR">`.
- Exception: documentation for the writers (how to publish, frontmatter fields, MDX
  components) lives in `docs/como-publicar.md` and is written in pt-BR, because its readers are
  the authors, not developers. Keep it updated whenever the content model or MDX components
  change.
- README: English, with a one-line pt-BR description at the top.
- Dates via `Intl.DateTimeFormat('pt-BR')` ("12 de novembro de 2026", short form "12 nov 2026").

## Domain glossary (use these names consistently, never mix languages in identifiers)

| pt-BR (UI and URLs)    | Code (types, variables, files)            | URL segment       |
| ---------------------- | ----------------------------------------- | ----------------- |
| Texto, artigo          | `Article`                                 |                   |
| Autor, autora          | `Author`                                  | `/autores`        |
| Obra                   | `Work`                                    |                   |
| Duas Leituras          | `TwoPerspectives`                         | `/duas-leituras`  |
| Leitura (I, II)        | `perspective`                             |                   |
| Filmes                 | category `film` (plural `films`)          | `/filmes`         |
| Livros                 | category `book` (plural `books`)          | `/livros`         |
| Séries                 | category `series`                         | `/series`         |
| Ensaios                | category `essay` (plural `essays`)        | `/ensaios`        |
| Sobre                  | `about`                                   | `/sobre`          |
| Busca                  | `search`                                  | `/busca`          |
| Etiqueta               | `tag` / `<Tag>` (inline mention)          | `/tags`           |
| Destaque               | `featured`                                |                   |
| Aviso de spoiler       | `spoilerWarning` / `<Spoiler>`            |                   |
| Nota de margem         | `<MarginNote>`                            |                   |
| Ficha da obra          | `WorkInfo`                                |                   |
| Leia a outra leitura   | `CompanionLink`                           |                   |
| Rascunho / Publicado   | status `draft` / `published` (+ `demo`)   |                   |

Map categories to pt-BR labels and slugs in one place (`src/lib/categories.ts`); never
hardcode a label or slug elsewhere.

## Stack

- Next.js (latest stable, App Router, React Server Components, static generation by default)
- TypeScript in `strict` mode (also `noUncheckedIndexedAccess`)
- Tailwind CSS v4, tokens defined as CSS variables (see design system)
- Content in the repo as MDX + YAML, validated with Zod at build time
- `next/font` for Cormorant Garamond, Source Serif 4 and Inter (self-hosted, no layout shift)
- `next/image` for every image; `next/og` for Open Graph images
- Lucide icons, only where an icon is needed
- pnpm; Node LTS (pinned in `.nvmrc` and `package.json#engines`)
- Quality: ESLint (flat config, next + typescript rules), Prettier, Vitest (unit),
  Playwright + `@axe-core/playwright` (smoke and accessibility), Husky + lint-staged + commitlint
- CI: GitHub Actions (install, typecheck, lint, unit tests, build). Hosting: Vercel.

No database, authentication, comments, CMS, analytics or newsletter in the first version.

## Architecture rules

```
content/                 MDX articles, author and work data (the only place content lives)
src/app/                 routes (thin: fetch from the content layer, compose components)
src/components/          presentational components, grouped by domain (layout, article, cards, ui)
src/content/             content layer: schemas, loaders, queries. The ONLY code that touches the filesystem.
src/lib/                 pure utilities (dates, reading time, SEO helpers, site config)
tests/                   e2e and accessibility tests
```

- Pages and components never read files. They call typed query functions from `src/content`
  (e.g. `getPublishedArticles`, `getArticle(category, slug)`, `getTwoPerspectives(slug)`).
  These functions return domain types, not raw frontmatter, so a headless CMS can replace the
  file loader later without touching the UI.
- No article content hardcoded in components.
- Server Components by default; `"use client"` only for real interactivity (theme toggle,
  spoiler reveal, mobile menu, share/copy, search input).
- Site-wide constants (name, URL, social links, nav) live in `src/lib/site-config.ts`; the
  base URL comes from `NEXT_PUBLIC_SITE_URL`.
- Code favours readability over brevity: descriptive names, explicit types at module
  boundaries, no clever one-liners. Follow `docs/engineering-conventions.md`.

## Content rules

- Article `status`: `draft` | `published` | `demo`. Production shows only `published`.
  `demo` entries appear only when `SHOW_DEMO_CONTENT=true` (local and preview environments),
  are visibly labelled as demonstration, and are never in the sitemap. A test guarantees this.
  Demo entries live only under `content/demo/`, which production never reads.
- Drafts are never committed to a public branch (the repository may be public).
- Published slugs are permanent: comments, likes, links and search results depend on them.
  A rename must declare the old slug so a permanent redirect is generated.
- A section with no content is hidden (homepage blocks, nav items such as Ensaios).
- Duas Leituras: one `Work` and exactly two articles that reference it, each by a different
  single author, both visible (both `published`, or both `demo`). Until the second text is
  published, the first is an ordinary article and no Duas Leituras entry exists. Validated at
  build time; the build fails on inconsistency.
- Tags are marked explicitly in the body with `<Tag>`; those marks populate the article's tag
  list. Frontmatter `tags` only adds tags not mentioned in the body. The link is one-way:
  a frontmatter tag never turns words in the text into links.
- Never invent real reviews, credentials or biographical facts. Use clearly marked
  placeholders until the authors provide the text.
- Every image needs pt-BR alt text and a credit/licence field. No scraped promotional images.
  Articles without a cover get the typographic fallback cover.

## Routes (pt-BR, clean URLs)

`/` · `/filmes` · `/livros` · `/series` · `/duas-leituras` · `/duas-leituras/[slug]` ·
`/ensaios` · `/sobre` · `/autores/[slug]` · `/tags/[slug]` · `/busca` · `/contato` ·
`/privacidade` · `/creditos`. Articles: `/filmes/[slug]`, `/livros/[slug]`, `/series/[slug]`, `/ensaios/[slug]`.
Plus `sitemap.xml`, `robots.txt`, a custom 404 and error page.

## Design essentials (full spec in docs/design-system.md)

- Contemporary cultural magazine, never a blog template, portal or database.
- Square corners, no shadows, no gradients (except the highlighter effect), minimal motion.
- Hierarchy through type, hairline rules and whitespace.
- Burgundy is an accent (kickers, links, notes, spoiler), never a large background.
- Light and dark themes from day one; dark follows the system preference, can be toggled
  and persisted, with no flash on load.
- Reading column ~66 characters; mobile reading must be excellent.

## Commands

- `pnpm dev`: local server
- `pnpm build` / `pnpm start`
- `pnpm typecheck` · `pnpm lint` · `pnpm format` · `pnpm test` · `pnpm test:e2e`
- `pnpm check`: typecheck + lint + unit tests

## Definition of done for any change

Types, lint and tests pass · builds · no console errors or hydration warnings · works at 360,
768 and 1280 px · keyboard-navigable with visible focus · light and dark themes checked ·
pt-BR copy reviewed · ADR written if a decision was made.
