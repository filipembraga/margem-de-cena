# 0004. Demonstration content isolation

- Status: Accepted
- Date: 2026-11-19

## Context

Development and preview deployments need realistic content before the authors publish
anything. Fictional entries must never appear in production. The repository may be public,
so unpublished drafts must not be committed either.

## Decision

Several independent layers:

1. **Location.** Demo entries live only under `content/demo/` (articles, works, Duas Leituras
   entries). The filesystem source reads that directory only when `SHOW_DEMO_CONTENT=true`.
2. **Schema.** Files under `content/demo/` must have `status: demo`, and `demo` is rejected
   anywhere else.
3. **Environment.** `src/lib/env.ts` validates environment variables with Zod and fails the
   build if `SHOW_DEMO_CONTENT=true` while `VERCEL_ENV=production`. On Vercel the flag is set
   only for Preview.
4. **Presentation.** When shown, demo content carries a visible "Conteúdo de demonstração"
   banner, a label on the article page, and `noindex`. It is never in the sitemap. Outside
   production, `robots.txt` disallows everything.
5. **Tests.** Unit tests check that demo records are not loaded without the flag and that the
   sitemap excludes them even with it. An end-to-end test against a production build checks
   that demo URLs return 404 and that no page contains the demo label.

Drafts: CI and the pre-commit hook reject any committed file with `status: draft`.

## Consequences

- Leaking demo content would require several independent failures.
- A published article that references demo-only data fails the production build, because
  the referenced record does not exist there. The mistake is caught before it reaches
  readers.
- CI builds twice: once in production mode for leak checks, and once with demo content as
  the end-to-end fixture, since production has no real articles yet.
