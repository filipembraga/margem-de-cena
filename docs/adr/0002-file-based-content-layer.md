# 0002. File-based content layer behind a source interface

- Status: Accepted
- Date: 2026-11-19

## Context

Content lives in the repository for the first version. It must be validated strictly at
build time and be replaceable by a headless CMS later without touching the UI. The brief
requires Duas Leituras to be a real relationship between a work and its articles, not two
unrelated articles that happen to share a title.

## Decision

**Formats.** Articles are MDX files with YAML frontmatter (`content/articles/<slug>.mdx`).
Authors, works and Duas Leituras entries are YAML files (`content/authors/`,
`content/works/`, `content/two-perspectives/`). Institutional pages are MDX
(`content/pages/`). The slug is the file name. Data keys are in English and values in pt-BR.

**Pipeline.** Only `src/content` touches the filesystem:

```
ContentSource  ->  Zod schemas  ->  integrity checks  ->  ContentCatalog  ->  query functions
(filesystem)       (per record)     (across records)      (immutable,        (public API)
                                                           memoized)
```

Query functions (`getPublishedArticles`, `getArticle`, `getTwoPerspectives`, ...) are async and
return domain types, never raw frontmatter. Listing types (`ArticleSummary`) carry no body.
Article bodies are typed as `{ format: 'mdx'; compiledCode: string; imageSizes }`: the MDX
is compiled once when the catalog loads (ADR 0003), and the dimensions of the body's images
travel with it (ADR 0010). *Amended on 2026-11-20; the first version stored the MDX source.*

**Model.**

- `Work` is a discriminated union on `category` (`film` | `book` | `series`), so each type
  carries only the fields its WorkInfo shows (directors and runtime, original authors and
  publisher, creators and platform).
- `TwoPerspectives` is its own entity: one work, **exactly two** ordered articles (Leitura I
  and II), and an introduction. An entry is committed only once both texts are published.
  Until then, the first text is an ordinary article.
- Derived fields are never written by hand: slug, reading time, tags mentioned in the body
  (ADR 0007) and the companion article.

**Integrity rules.** All violations are collected and reported together, with file paths, and
fail the build:

- Slugs are kebab-case ASCII, unique across all articles (demo included) and unique within
  each collection.
- Referenced authors and works exist. An article has one or two distinct authors.
- An article's category matches its work's category. Essays do not reference a work.
- A Duas Leituras entry references an existing work and exactly two existing articles. Both
  articles reference that work, each has a single author, the two authors differ, and both
  have the same visibility (both `published`, or both `demo`). An article belongs to at most
  one entry.
- `publishedAt` is required unless the status is `draft`, and `updatedAt` cannot precede it.
- At most one published article is `featured`.
- Image files exist and can be read (their dimensions are kept, ADR 0010), and every image
  has alt text, a credit and a licence.
- Two tag spellings that produce the same slug are an error.

Validation messages are written in pt-BR, because the authors are the ones who read them.

**Slug permanence.** Once published, a slug never changes silently. A rename declares the
previous slug, which becomes a permanent (308) redirect.

## Consequences

- A CMS adapter only has to implement `ContentSource`. Schemas, integrity checks and queries
  are reused, and the UI does not change. A non-MDX body format (for example Portable Text)
  would need one new body variant and renderer.
- Stable, globally unique slugs give future per-article data (likes, comments) a reliable
  key. That data will live outside the content layer.
- The whole catalog is held in memory during the build, which is fine at this scale.
- The approved mockup's "only one reading published" state is not implemented, which keeps
  the UI simpler.
