# 0001. Static generation with the Next.js App Router

- Status: Accepted
- Date: 2026-11-19

## Context

Margem de Cena is an editorial publication that changes a few times a month. It starts with
a handful of articles, has no user-specific data in its first version, and is hosted on
Vercel. The brief asks for excellent performance, solid SEO and no database. Social sign-in,
likes and comments are expected soon after launch, so the rendering model must not rule
them out.

## Decision

- Use Next.js 16 with the App Router and React Server Components.
- Generate every route statically at build time. Dynamic segments use
  `generateStaticParams` with `dynamicParams = false`, so an unknown slug returns a real 404.
- The four category archives (`/filmes`, `/livros`, `/series`, `/ensaios`) share a single
  `[category]` segment. Its params come from `src/lib/categories.ts`, the one place that maps
  categories to pt-BR labels and slugs.
- Do not use `output: 'export'`. Keeping the standard Vercel build preserves `next/image`
  optimization and the option to add server-rendered parts later.
- Leave Cache Components off until a feature needs request-time rendering.
- Pin the toolchain: Node 26 LTS (`.nvmrc`, `engines`), pnpm 12 (`packageManager`) and
  TypeScript 6.0.x. TypeScript 7 is out, but `typescript-eslint` (used by
  `eslint-config-next`) currently supports only `<6.1.0`.

## Consequences

- Pages need no request-time server code, so they are fast and fully cacheable.
- Publishing requires a rebuild. Content lives in git and every merge to `main` deploys, so
  this is acceptable. Scheduled publication is not supported.
- Future sign-in, likes and comments fit without re-architecture. Article pages stay static
  and the interactive parts become dynamic islands. User-generated data will live in its own
  module and storage, separate from editorial content (see ADR 0002), and will need its own
  ADRs for authentication, storage, moderation and LGPD compliance.
- Upgrading to TypeScript 7 waits for `typescript-eslint` support.
