# 0003. Compile MDX with @mdx-js/mdx inside the content layer

- Status: Accepted
- Date: 2026-11-19

## Context

Options evaluated in November 2026:

- `next-mdx-remote`: the repository is archived.
- `@next/mdx`: official, but it treats MDX files as imported modules. That makes frontmatter
  validation and listing awkward, requires serializable plugin options under Turbopack (the
  default bundler in Next.js 16), and couples content to the bundle, which works against the
  CMS boundary in ADR 0002.
- `next-mdx-remote-client`: the right model (compile a string in Server Components), but a
  thin wrapper maintained by a single person.
- `content-collections` and `velite`: pre-1.0 content pipelines with their own schemas and
  code generation. They would duplicate and hide the content layer we want to own.

## Decision

- Use `@mdx-js/mdx` v3 directly. It is the upstream compiler that all the options above build
  on.
- Each article is compiled once, when the catalog loads (`compile` with
  `outputFormat: 'function-body'`). The same pass runs small local remark plugins that:
  - reject `import`/`export` and any component outside the allowed list (`Spoiler`,
    `MarginNote`, `Highlight`, `PullQuote`, `Figure`, `Tag`);
  - collect `<Tag>` mentions (ADR 0007);
  - count words for the reading time.
- At render time, `ArticleBody` (a Server Component) runs the compiled code with the
  component map.

## Consequences

- One well-maintained dependency, with plugins as plain functions and no Turbopack
  restriction.
- The body enters the system as a string, which matches the `ContentSource` boundary.
- Invalid MDX fails the build with the file path, not at render time.
- MDX is executed as code. This is acceptable because only the authors write content,
  through the repository. It must be revisited if untrusted editors are ever added.
- We maintain roughly a hundred lines of integration code and plugins, covered by unit tests.
