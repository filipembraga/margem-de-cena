# 0007. Explicit inline tag mentions and tag pages

- Status: Accepted
- Date: 2026-11-19

## Context

Cultural publications often link people, works and themes inside the text to a page that
gathers every article about them, for example an actor's or a writer's name. We want the
same: a word in the body links to a page that lists every text with that tag, and the
article's tag list stays consistent with what the text mentions.

Two approaches were considered:

- **Automatic:** link every occurrence of each frontmatter tag in the body. It costs authors
  nothing, but it misfires in Portuguese (inflections such as "memória" and "memórias",
  homonyms, matches inside headings, quotes or spoilers). It also fills the text with links,
  against the design's restraint.
- **Explicit:** authors mark the mention, and the mark both creates the link and adds the tag.

## Decision

- Authors mark mentions with an MDX component: `<Tag>Alice Hoffman</Tag>`, or
  `<Tag name="memória">memórias</Tag>` when the visible text differs from the tag.
- Marks found during compilation (ADR 0003) populate the article's tag list. The frontmatter
  `tags` field only adds tags that are not mentioned in the body. The resulting list is
  deduplicated by slug and limited to 12 tags.
- The relationship is **one-way**. A frontmatter tag never turns words in the text into links;
  only the author decides which words are links.
- Each tag has a static page at `/tags/[slug]` listing the visible articles across all
  categories. The slug strips accents (`memória` becomes `memoria`, `Alice Hoffman` becomes
  `alice-hoffman`). The tag chips at the end of an article link to the same page.
- Two different spellings of the same slug across articles fail the build, which keeps one
  canonical name per tag.

## Consequences

- Authors control every link. The cost is marking mentions by hand, documented in
  `docs/como-publicar.md`.
- Tag pages work without JavaScript, are indexable and shareable, and do not depend on the
  search page.
- `/tags` is the one URL segment that is not a pt-BR word. The product owner chose it because
  "tag" is common in Brazilian web usage. Interface copy keeps the glossary term "Etiquetas".
- In MDX, the component is `Tag`; the visual chip is `TagChip`, so the names do not collide.
- A development-only hint (a frontmatter tag that appears in the text but is not marked) is a
  possible later improvement. It would never link text automatically.
