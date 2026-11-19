# Engineering conventions

How code in this repository is written. The goal is code that a reader who has never seen
the project, including a developer coming from a backend background, can follow without
decoding it. **When readability and brevity conflict, readability wins**, as long as the
code stays idiomatic TypeScript and React.

These conventions complement `CLAUDE.md` (architecture, language and domain glossary) and the
ADRs in `docs/adr/`. ESLint and Prettier enforce what can be automated; the rest is checked in
review.

## Naming

- Names say what a thing is or does. Prefer `article`, `author`, `publishedArticles` over `a`,
  `x`, `items`, `data`.
- No abbreviations except universally understood ones (`id`, `url`, `html`, `seo`, `og`).
  `formatLongDate`, not `fmtDate`; `readingTimeInMinutes`, not `rtMin`.
- Callback parameters get real names: `articles.map((article) => ...)`, not
  `articles.map((a) => ...)`. ESLint rejects one-letter identifiers; `_` marks an unused
  parameter.
- Booleans read as yes/no questions: `isRevealed`, `hasCover`, `shouldShowDemoBanner`.
- Event handlers: the prop is `onReveal` and the local handler is `handleRevealClick`.
- Functions start with a verb: `getArticle`, `formatShortDate`, `buildSitemapEntries`,
  `validateTwoPerspectives`.
- Domain names come from the glossary in `CLAUDE.md` (`Article`, `Work`, `TwoPerspectives`,
  `perspective`). Do not invent synonyms (`post`, `review`, `item`).
- Types and components use `PascalCase`; variables and functions use `camelCase`; true
  constants use `SCREAMING_SNAKE_CASE` only when they are configuration-like
  (`ARTICLES_PER_PAGE`).
- Files: components `PascalCase.tsx` (`ArticleCard.tsx`), everything else `kebab-case.ts`
  (`reading-time.ts`). Tests sit next to the file they test: `reading-time.test.ts`.

## Types and functions

- Exported functions in `src/lib` and `src/content` declare their parameter and return types
  explicitly (enforced by ESLint). React components declare a props type; their return type is
  inferred. Inside a function, let inference do its job.
- Prefer named, small types over inline anonymous ones at module boundaries:
  `type ArticleSummary = ...`, then `getPublishedArticles(): Promise<ArticleSummary[]>`.
- Use `type` for data shapes and unions, and `interface` for contracts that something
  implements (`interface ContentSource`). No `I` prefix.
- Avoid `any`. Use `unknown` for untrusted input and narrow it with Zod.
- Model alternatives as discriminated unions (`work.category === 'film'`), not optional
  fields that are only sometimes valid.
- Prefer pure functions. Side effects (filesystem, environment) live at the edges:
  `src/content/sources/` and `src/lib/env.ts`.
- Named exports only, except where Next.js requires a default export (`page.tsx`,
  `layout.tsx`, ...).
- Early returns over nested conditionals. One level of ternary at most; beyond that, use an
  `if` or a small named function.

## React components

- Server Components by default. Add `"use client"` only for real interactivity, and keep the
  client part as small as possible.
- Props are a named type next to the component: `type ArticleCardProps = { ... }`.
- Variants are explicit props with named values (`variant: 'default' | 'compact' | 'featured'
  | 'numbered'`), not boolean flags that combine into impossible states.
- Logic that is not about rendering goes into a named hook or helper. `useTheme()` is easier
  to read than a raw `useSyncExternalStore` call inside the component.
- A component that grows past one screen, or mixes several responsibilities, is split into
  named subcomponents.

## Styling

- Tailwind utilities reference design tokens only (`bg-bg`, `text-accent`), never raw hex
  values.
- When a class list becomes hard to read or repeats, extract it: into a named component, or
  into a named variant map (`const cardVariants = { featured: '...', compact: '...' }`).
- Combine conditional classes with the local `classNames()` helper, not string templates.

## Errors and validation

- Untrusted input (content files, environment variables) is parsed with Zod at the boundary.
  Everything inside works with validated domain types.
- Content validation collects every problem before failing, so the build reports all of them
  at once, each with its file path. These messages are in pt-BR because the authors read them.
- Do not swallow errors. If a `catch` is required (for example, browser storage), comment why
  ignoring the error is safe.

## Comments

- Comments explain **why**, not what: a constraint, a trade-off, a link to an ADR. If a
  comment explains what the code does, rename things until it does not need to.
- Exported functions of the content layer and `src/lib` get a one-line TSDoc summary.

## Tests

- Test names are sentences that describe behaviour:
  `it('hides demo articles when SHOW_DEMO_CONTENT is not set')`.
- Arrange, act, assert, separated by blank lines. One behaviour per test.
- Fixtures are small and named for what they represent (`articleWithoutCover`), not
  `fixture1`.

## Coming from .NET

| Familiar pattern                    | Here                                                        |
| ----------------------------------- | ----------------------------------------------------------- |
| `interface IContentSource`          | `interface ContentSource` (no `I` prefix)                   |
| Service classes with injected deps  | Modules exporting functions; dependencies passed as params  |
| DI container                        | Not needed: import the module, or pass the dependency in    |
| Repository class                    | `src/content` query functions over a `ContentSource`        |
| `Result<T>` / validation results    | Zod `safeParse` plus a collected list of integrity issues   |
| Data annotations                    | Zod schemas, with types inferred from them                  |
| Bounded contexts                    | `src/content` (editorial) separate from future user data    |
