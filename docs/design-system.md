# Margem de Cena — Design System v0.1

Approved on 2026-11-18. Source mockups: `docs/design/screens/` and `docs/design/reference/`.

## 1. Concept

The "margin" of an annotated book meets the "scene" of a film frame. Recurring motifs:

- **Margin rule:** a 2px burgundy vertical line to the left of the wordmark, quotes and margin notes.
- **Marginalia:** short notes in Cormorant italic, burgundy, with a superscript number tied to
  the body text. On desktop they sit in a side column; on mobile they flow right after the paragraph.
- **Highlighted passage:** beige "highlighter" band behind the lower 40% of the text line.
- **Frame crop marks:** 24px L-shaped corners offset 8px outside cover images (featured and article).
- **Section markers:** `§ 01`, small italic numerals (`01`, `02`) for essays and lists,
  `· · ·` as an end-of-text mark, double rule (`3px double`) above section headings.

Avoid: film reels, clapperboards, popcorn, book icons, stars/ratings, rounded cards, shadows,
gradient backgrounds, decorative animation, stock photography.

## 2. Color tokens

Define as CSS custom properties in `:root` and `[data-theme="dark"]`, exposed to Tailwind v4
through `@theme`. Components use semantic tokens only, never raw hex values.

| Token          | Light     | Dark      | Use                                                  |
| -------------- | --------- | --------- | ---------------------------------------------------- |
| `--bg`         | `#F4F0E8` | `#1C1B19` | page background (paper)                              |
| `--fg`         | `#252522` | `#ECE6DA` | primary text, rules, primary button                  |
| `--fg-soft`    | `#3A3935` | `#CFC8BB` | excerpts, standfirst, secondary body text            |
| `--muted`      | `#6A665F` | `#A39D92` | metadata, captions, small labels (≥ 4.5:1)           |
| `--muted-lg`   | `#77736D` | `#8F897E` | large text or decoration only (fails at small sizes) |
| `--line`       | `#DCD2C3` | `#3A3833` | hairlines, image placeholders, tag borders           |
| `--band`       | `#DCD2C3` | `#26241F` | full-width bands (Duas Leituras, companion block)    |
| `--accent`     | `#652F3B` | `#D9A9B2` | kickers, links, notes, spoiler, active nav           |
| `--accent-ink` | `#F4F0E8` | `#1C1B19` | text on an accent fill (tags, avatar)                |
| `--highlight`  | `#DCD2C3` | `#4A2A31` | highlighted passage band                             |
| `--inverse-bg` | `#252522` | `#ECE6DA` | Instagram band, top strip, typographic cover         |
| `--inverse-fg` | `#F4F0E8` | `#1C1B19` | text on inverse                                      |

Contrast checked: fg on bg 14:1, accent on bg 9.6:1, muted on bg 5.0:1 (light);
muted 6.3:1, accent 8.4:1 (dark). Keep every text pair at or above 4.5:1.

## 3. Typography

| Role      | Family             | Weights                  | Where                                                      |
| --------- | ------------------ | ------------------------ | ---------------------------------------------------------- |
| Display   | Cormorant Garamond | 500, 400 italic, 500 ital | wordmark, titles, headings, standfirst, quotes, notes      |
| Reading   | Source Serif 4     | 400, 600, 400 italic     | article body, excerpts, bios                               |
| Interface | Inter              | 400, 500, 600            | nav, kickers, metadata, buttons, forms, captions           |

Load with `next/font/google`, `display: swap`, latin subset (includes Portuguese diacritics).
Expose as `--font-display`, `--font-reading`, `--font-ui`.

### Scale (desktop → mobile)

| Token            | Family / style        | Size / line-height             | Notes                        |
| ---------------- | --------------------- | ------------------------------ | ---------------------------- |
| `article-title`  | Display 500           | 84/0.92 → 48/0.94, -0.02em     | article h1                   |
| `hero-title`     | Display 500           | 64/0.95 → 44/0.96, -0.015em    | home featured, work title 96 |
| `section-title`  | Display 500           | 40/1.05 → 32/1.05              | h2 in body, home blocks      |
| `card-title`     | Display 500           | 28/1.05 → 26/1.05              | cards                        |
| `standfirst`     | Display italic 400    | 26/1.3 → 21/1.3                | subtitle under title         |
| `quote`          | Display italic 400    | 34/1.2 → 27/1.2                | blockquote, 2px accent rule  |
| `note`           | Display italic 400    | 19/1.3 → 18/1.3                | marginalia                   |
| `body`           | Reading 400           | 20/1.72 → 18/1.7               | max 680px (~66 chars)        |
| `excerpt`        | Reading 400           | 15/1.55 (featured 18/1.6)      | cards                        |
| `kicker`         | UI 600, uppercase     | 11, letter-spacing 0.16em      | category labels (accent)     |
| `nav`            | UI 500, uppercase     | 12–13, letter-spacing 0.12em   |                              |
| `meta`           | UI 400                | 13 (cards 12)                  | author · date · reading time |
| `caption`        | UI 400                | 12                             | figcaption, credits          |

Drop cap: first paragraph only, Display 92px (72 mobile), accent color, 3 lines.

## 4. Space and layout

- Base unit 4px. Common gaps: 8, 12, 16, 24, 32, 40, 48, 56, 72, 88.
- Container max-width 1240px; horizontal padding 32px (20px below 640px).
- Article grid (≥ 1024px): left aside 200px (work info) · body 680px · right aside 200px
  (marginalia), 56px gaps. Below 1024px: single column; work info becomes a collapsible
  `<details>` above the body; notes flow inline.
- Section vertical rhythm: 56–88px desktop, 40–56px mobile.
- Radius: 0 everywhere. Only avatars are circles.
- Shadows: none. Elevation is expressed with rules and bands.
- Breakpoints: Tailwind defaults (sm 640, md 768, lg 1024, xl 1280).

## 5. Images

- Ratios: featured 16:10, article cover 21:9 (4:3 on mobile), cards 3:2, category block 16:9,
  book covers 2:3 at natural proportion (never stretched into a store-like grid), Duas Leituras
  shared cover 3:4.
- Placeholder: `--line` fill with a small uppercase caption. Never stock photos.
- **Typographic fallback cover** (no licensed image): `--inverse-bg` fill, work title in
  Display italic (`--inverse-fg`), optional kicker in accent-light. Same ratios as images.
- Every image: pt-BR alt, credit/licence in caption or credits page.

## 6. Components

- **Wordmark** — "Margem *de* Cena": Display 500, "de" italic 400 in accent, 2px accent margin
  rule on the left. Variants: horizontal (header), stacked (footer, about), monogram "M*c*"
  (favicon, Instagram avatar, OG fallback). Text-based, accessible name "Margem de Cena".
- **Header** — wordmark, tagline (desktop only, Display italic, muted), search and Instagram
  icon buttons (44px targets, aria-labels), nav row in uppercase UI, 1px bottom rule. Mobile:
  wordmark + search + menu button opening a full-height nav panel. Active section in accent.
- **Footer** — stacked wordmark, nav, legal links, contact, ©.
- **ArticleCard** — variants `default` (image, kicker, title, excerpt, meta), `compact`
  (title + meta, used in category lists), `featured` (home hero, large image + text column),
  `numbered` (essays list: italic numeral, big title, meta). Whole title is the link.
- **Kicker / Byline / Meta** — category in accent uppercase; "Por {autor}" with links to author
  pages; co-authors joined with "e"; date · reading time.
- **SectionHeading** — label left, optional link right, double rule above.
- **TwoPerspectives block** — band background, work title, short concept text, two columns
  separated by a 1px vertical rule ("Leitura I" / "Leitura II"). Always two readings: an entry
  exists only once both texts are published (decision of 2026-11-19, see ADR 0002), so the
  single-reading state in the mockup is not implemented.
- **CompanionLink** — at the end of a Duas Leituras article: band block linking to the other text.
- **WorkInfo** — left aside / mobile `<details>`: title, original title, director/creator or
  author, year, publisher, platform, seasons; only fields present are rendered.
- **MarginNote** — numbered note, accent rule; anchored to a superscript reference.
- **Highlight** — `<mark>` styled with the highlighter band.
- **Blockquote / PullQuote** — Display italic with 2px accent rule.
- **Spoiler** — banner with accent top and bottom rules, label "Atenção: spoiler", short
  description and a "Revelar trecho" button (`aria-expanded`, `aria-controls`). Hidden text
  is not rendered visibly or read by screen readers until revealed; skeleton lines stand in.
  An article-level `spoilerWarning` shows a notice under the byline; the whole article is
  never hidden.
- **Tags** — 1px `--line` border chips (`TagChip`), linking to the tag page `/tags/[slug]`.
  Inline mentions in the body (`<Tag>` in MDX) render exactly like regular body links.
- **ShareBar** — "Compartilhar": Copiar link (with "Link copiado" feedback via live region),
  WhatsApp, Threads, E-mail; uses Web Share API on mobile when available.
- **PrevNext**, **RelatedArticles** (3 cards), **AuthorCard** (avatar placeholder, name, short
  bio, Instagram handle).
- **InstagramInvite** — inverse band, Display line, outline button.
- **ThemeToggle** — icon button (sun/moon), aria-label "Ativar tema escuro"/"Ativar tema claro".
- **Buttons** — primary: `--fg` fill, `--bg` text; secondary: 1px `--fg` outline; min height 44px.
- **EmptyState** — Display italic sentence + short UI text, no illustrations.

## 7. Interaction and accessibility

- Links: accent color, underline offset 4px in body text; hover darkens or underlines.
- Focus: 2px outline in `--accent`, offset 3px, on every interactive element.
- Transitions: ≤ 150ms on color/opacity only; respect `prefers-reduced-motion`.
- Semantic landmarks, one h1 per page, skip link "Pular para o conteúdo".
- Touch targets ≥ 44px. Text contrast ≥ 4.5:1 in both themes.

## 8. Voice in the interface (pt-BR)

Calm, literate, direct. Examples: "Recentes", "Ver tudo", "Ler esta leitura", "Leia a outra
perspectiva", "Por enquanto, nada publicado nesta seção.", "Nenhum resultado para “{termo}”."
