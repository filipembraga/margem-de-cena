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

Open http://localhost:3000. With demo content enabled, the component preview is at
http://localhost:3000/componentes.

### Environment variables

| Variable               | Default                 | Purpose                                                                                                       |
| ---------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public base URL for canonical URLs, Open Graph and the sitemap.                                               |
| `SHOW_DEMO_CONTENT`    | `false`                 | Shows demonstration content and the component preview. Local and Vercel Preview only; the build fails if it is `true` in production. |

## Scripts

| Command                     | What it does                                                       |
| --------------------------- | ------------------------------------------------------------------ |
| `pnpm dev`                  | Development server                                                 |
| `pnpm build` / `pnpm start` | Production build and server                                        |
| `pnpm check`                | Typecheck, lint and unit tests (run before every commit proposal)  |
| `pnpm test`                 | Unit tests (Vitest)                                                |
| `pnpm test:e2e`             | Smoke and accessibility tests (Playwright + axe) on a production build with demo content |
| `pnpm format`               | Format with Prettier                                               |

The first end-to-end run needs a browser: `pnpm exec playwright install chromium`.

## Project structure

```
content/          articles, authors and works (MDX + YAML), from Stage 3
src/app/          routes
src/components/   presentational components (layout, ui, cards)
src/content/      content layer: the only code that reads files, from Stage 3
src/lib/          pure utilities: categories, dates, environment, theme, site config
tests/            end-to-end and accessibility tests
docs/             brief, design system, ADRs and engineering conventions
```

## Documentation

- [Product brief](docs/briefing.md)
- [Design system](docs/design-system.md)
- [Architecture decision records](docs/adr/)
- [Engineering conventions](docs/engineering-conventions.md)

## Workflow

Work happens in stages, one branch and pull request per stage, with Conventional Commits.
Each pull request description is the stage report. CI runs typecheck, lint, formatting, unit
tests, a production build and the end-to-end suite on every pull request
([ADR 0006](docs/adr/0006-quality-gates-and-branch-workflow.md)).
