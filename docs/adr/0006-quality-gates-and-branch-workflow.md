# 0006. Quality gates and branch workflow

- Status: Accepted
- Date: 2026-11-19
- Amended: 2026-11-21 (AI attribution rule, list of texts to fill in)

## Context

The repository is also a portfolio piece. History, automated checks and reproducibility
matter as much as the visual result. The work is done in stages, and each stage is approved
before it is merged.

## Decision

**Tooling.**

- pnpm 12 with a frozen lockfile.
- ESLint flat config based on `eslint-config-next` (Next.js, TypeScript, React Hooks and
  jsx-a11y rules), and Prettier with the Tailwind plugin.
- Vitest for pure logic: schemas, integrity rules, queries, dates, slugs, search and SEO
  helpers. It also runs an integrity test over the real `content/` directory.
- Playwright for smoke tests against a production build (`next build && next start`) at
  360, 768 and 1280 px. Any console error or hydration warning fails a test.
- `@axe-core/playwright` for WCAG 2.x A/AA checks on every page template, in both themes.
- Husky, lint-staged and commitlint enforce formatting, lint and Conventional Commits
  locally. A local commitlint rule (`scripts/commitlint/no-ai-attribution.mts`) rejects AI
  attribution in a message: a `Co-Authored-By` trailer naming Claude or Anthropic, or a
  "Generated with" line.

**CI (GitHub Actions)**, on every pull request and on pushes to `main`:

1. `quality`: install, typecheck, lint, format check, unit tests, commitlint on the PR's
   commits (so a commit made with `--no-verify` is still checked), the no-drafts check, and
   the list of `[A PREENCHER: …]` texts as warnings.
2. `build-production`: build without demo content, then run the demo-leak checks.
3. `e2e`: build with demo content, then run the smoke and accessibility suites. The
   Playwright report is uploaded when a test fails.

**Branches.**

- `main` is always deployable and protected: changes arrive only through pull requests with
  green checks.
- There is one branch per stage or feature (`feat/visual-foundation`,
  `feat/content-layer`, ...), with small atomic commits.
- Pull requests are merged with a merge commit, which keeps the atomic commits and shows
  where each stage begins and ends.
- Each stage report becomes its pull request description: what changed, how to verify it,
  assumptions and open questions. Pull requests serve as the project's work log; no
  separate log files are kept in the repository.
- Vercel deploys a preview (with demo content) for each pull request, and production from
  `main`.

## Consequences

- CI is slower (two builds) in exchange for explicit guarantees.
- The history reads stage by stage. Decisions live in ADRs and the reasoning of each stage
  lives in its pull request.
- The project depends on GitHub and Vercel settings (branch protection, environment
  variables), which the README documents.
