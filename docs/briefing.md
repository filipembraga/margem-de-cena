# MARGEM DE CENA
## Product Briefing, Brand Identity & Website Development

> Original product brief written by the project owner. Decisions made after this brief
> (design system, dark theme in v1, author names, stack details) are recorded in
> `CLAUDE.md`, `docs/design-system.md` and `docs/adr/`, and take precedence where they differ.

---

# 1. PROJECT CONCEPT

**Name:** Margem de Cena

**Tagline (initial proposal):**
"Histórias que permanecem. Leituras que se encontram."

Alternative supporting phrase:
"Um espaço para pensar sobre as histórias que nos atravessam."

**What is Margem de Cena?**

Margem de Cena is an independent cultural publication created by two people who enjoy experiencing, interpreting and writing about cultural works.

The publication focuses on films, books and television series, exploring not only what happens in a story, but also what it communicates, how it is constructed, what it makes us feel and what remains with us after the experience.

The name combines two ideas:

- "Margem": the margins of a book, annotations, interpretations, observations and thoughts that emerge beyond the original work.
- "Cena": cinema, audiovisual storytelling, moments, scenes and the broader idea of narratives.

The concept is intentionally broader than film criticism. It should accommodate literature, television and future cultural subjects without requiring a rebranding.

The publication should feel like an independent cultural magazine, not a personal blog, entertainment news portal or social-media review account.

## Editorial philosophy

We believe that a work of art does not end when the book is closed or the screen goes dark.

Some stories remain with us, generate questions, provoke disagreements and acquire new meanings as we reflect on them.

Our purpose is to share these experiences through thoughtful, personal and well-constructed writing.

We do not intend to establish definitive interpretations or pretend to possess the final word about any work.

We want to develop our own perspectives, supported by arguments, references, research and personal experience.

Different readers can encounter the same work and find completely different meanings. That diversity is part of the publication's identity.

---

# 2. WHO WE ARE

Margem de Cena is written by two authors with different backgrounds, interests and writing styles.

Create an About page that presents both authors as individuals and as collaborators.

Do not invent personal names, photographs, professional credentials or biographical details. Use editable placeholders until we provide the final information.

## Author 1 — Filipe Braga

A backend software engineer with an analytical and curious perspective on stories and cultural works. Instagram: @djfillzouk

Areas of interest include:

- Complex narratives and storytelling.
- Symbolism, mythology and archetypes.
- Fantasy, horror, science fiction and psychological thrillers.
- Narrative structure, worldbuilding and character development.
- Philosophical, psychological and sociocultural interpretations.
- The relationship between technology, society and human experience.

His writing tends toward analytical exploration, examining how narratives work, what lies beneath their surface and which ideas they communicate.

His texts may combine personal interpretation, contextual research and structural analysis.

## Author 2 — Adriana Guimarães

An educator with a degree in Pedagogy, specialization in education and experience as an elementary literacy teacher in a private school. Instagram: @drika0

Her relationship with stories is strongly connected to literature, language, reading experiences, human relationships and education.

Her writing tends toward a more sensitive, poetic and subjective perspective, exploring:

- Emotional experiences and personal connections.
- Characters and human relationships.
- Language and literary expression.
- Memory, identity and belonging.
- The impact of stories on everyday life.
- The meanings that emerge from reading and watching.

Her texts may explore how a work touches the reader or viewer, what it evokes and how its themes relate to human experience.

## Our shared identity

Neither author should be confined to these descriptions.

They are editorial tendencies, not rigid roles.

Both authors can write analytical, emotional, technical or reflective texts.

The website must clearly identify the author or authors of each publication.

Some works will generate one text. Others may generate two independent texts. Occasionally, both authors will collaborate on a single article.

The differences between our perspectives should be celebrated, not artificially eliminated.

---

# 3. EDITORIAL POSITIONING AND REFERENCES

The main editorial reference is the Brazilian website Plano Crítico.

Use it as inspiration for:

- Thoughtful cultural criticism.
- Long-form articles.
- Contextualization and interpretation.
- Editorial seriousness.
- A publication that values writing rather than superficial ratings.
- The relationship between criticism, personal perspective and cultural discussion.

Important: do not copy its layout, visual identity, text, structure or branding.

Margem de Cena needs its own visual and editorial personality.

Other visual references should include independent literary magazines, contemporary cultural journals, editorial publications and minimalist print-inspired websites.

The experience should evoke opening a well-designed cultural magazine.

Avoid the appearance of:
- A generic WordPress blog.
- A commercial entertainment portal.
- A film database.
- A review aggregator.
- An influencer's recommendation page.

Do not prioritize numerical ratings or star systems. The emphasis should be on the text and the author's interpretation.

---

# 4. BRAND IDENTITY AND ART DIRECTION

## General direction

Contemporary cultural magazine.

The visual language should combine editorial sophistication, literary references and modern web design.

The website must feel elegant, readable, distinctive and timeless.

It should be visually interesting without competing with the content.

## Color palette

Initial palette (final tokens, including the dark theme, are in `docs/design-system.md`):

- Warm off-white / paper: #F4F0E8
- Deep charcoal: #252522
- Dark burgundy: #652F3B
- Muted beige: #DCD2C3
- Secondary gray: #77736D

The palette should communicate warmth, intellectual curiosity and editorial sophistication.

Burgundy should be used as an accent, not as the dominant background color.

Use dark text on light backgrounds for the primary reading experience.

Dark theme: approved for the first version (see design system).

## Typography

Approved combination (see design system): Cormorant Garamond (display), Source Serif 4 (reading), Inter (interface).

Typography must prioritize comfortable long-form reading, especially on mobile devices.

## Graphic elements

Explore subtle references to:
- Book margins.
- Editorial annotations.
- Page numbering.
- Underlines and highlighted passages.
- Film frames and photographic crops.
- Magazine section dividers.
- Printed-paper textures, used sparingly.

Avoid obvious clichés such as large film reels, clapperboards, popcorn illustrations or book icons.

## Photography and artwork

The editorial layout should allow large cover images, film stills, book covers and series artwork.

Images must be visually integrated into the layout.

Use placeholders for the initial implementation.

Do not scrape copyrighted promotional images or use images without an appropriate license or authorization.

Create a consistent fallback design for articles without cover images.

---

# 5. WEBSITE ARCHITECTURE

## 5.1 Home

The homepage is the publication's editorial showcase.

Suggested structure:

1. Header with logo, navigation and Instagram link.
2. Main featured article with large editorial image.
3. Recent publications.
4. Featured section: Duas Leituras.
5. Editorial category highlights: Filmes, Livros, Séries.
6. Selected essays.
7. Short About section introducing the two authors.
8. Instagram/social media invitation.
9. Footer with navigation and contact information.

The homepage should feel curated, not like an endless chronological feed.

The featured article must be configurable.

Recent publications should be dynamically populated from published content.

If there is no content in a section, hide the section rather than showing empty placeholders or invented articles.

## 5.2 Filmes

Archive of articles about movies.

Each article card should display: cover image, article title, short excerpt, author name or names, publication date, relevant tags.

The category should support filtering and pagination or progressive loading.

## 5.3 Livros

Archive of articles about books.

Use an editorial presentation that allows book covers to appear naturally without making the page resemble an online bookstore.

Article metadata may include: book title, author of the original work, publisher, original publication year, edition or translation details when relevant.

Do not require all metadata for every article.

## 5.4 Séries

Archive of articles about television series and miniseries.

Support optional metadata: original title, release year, creator, platform or broadcaster, number of seasons when relevant.

## 5.5 Duas Leituras

This is one of the most important sections of the publication.

It presents two independent interpretations of the same cultural work, written by the two authors.

A Duas Leituras entry should contain:

- Shared work title.
- Work category: film, book or series.
- Shared cover image.
- A short introduction explaining the concept.
- Two article cards, one for each author's perspective.
- Author identification.
- Individual article excerpts.

Readers should be able to open each text independently and navigate easily between the two perspectives.

If only one author has published a text, the entry must not falsely suggest that the second text exists.

The data model should support a shared work entity associated with two separate articles.

This should not be implemented as two unrelated articles that merely happen to have the same title.

## 5.6 Ensaios

An archive of longer, more reflective and thematic texts.

Essays may discuss: a particular theme across different works, genres and artistic movements, narrative techniques, cultural and philosophical questions, the relationship between fiction and reality, literature, cinema and society.

Essays do not need to be associated with one specific work.

The section should remain hidden from the main navigation and homepage if no essay has been published yet.

## 5.7 Sobre

Present the concept of Margem de Cena, the editorial philosophy and both authors.

Include: the story behind the name, why the publication exists, our different perspectives, our shared relationship with cultural works.

## 5.8 Optional pages

Include basic infrastructure for: search, contact, privacy policy, editorial credits.

Do not create complicated functionality that is unnecessary for the initial launch.

---

# 6. ARTICLE EXPERIENCE

Article pages are the most important part of the entire product.

The reading experience must be excellent.

Each article should support: large title, subtitle or editorial introduction, author information, publication date, category, cover image, estimated reading time, rich text content, headings and subheadings, blockquotes, images and captions, lists, external links, references and credits when applicable, tags, related articles, navigation to the next or previous article, social sharing.

Use a comfortable reading column with appropriate line length, spacing and typography.

The design should not make the reader feel overwhelmed by metadata or decorative elements.

## Spoilers

Articles must support an optional spoiler warning.

If enabled, show a visible notice before the relevant content.

Implement a reusable spoiler component that allows readers to reveal spoiler-sensitive passages intentionally.

Do not automatically hide entire articles.

## Author identification

Each article must clearly identify its author.

For coauthored articles, show both authors.

For Duas Leituras articles, provide an obvious link to the companion article.

---

# 7. CONTENT MODEL

Create a simple, extensible content architecture.

**Article:** id, slug, title, subtitle, excerpt, content, coverImage, category, authors, publicationDate, updatedDate, tags, featured, spoilerWarning, readingTime, status (draft or published), relatedWorkId (optional)

**Author:** id, name, slug, shortBio, fullBio, profileImage, socialLinks

**Work:** id, title, originalTitle (optional), category, releaseYear (optional), directorOrCreator (optional), originalAuthor (optional), coverImage, description (optional)

**TwoPerspectives:** id, workId, articleIds, introduction

An article can have one or two authors.

A Work can have one or multiple associated articles.

A TwoPerspectives entity connects two independent articles about the same work.

Avoid unnecessary database complexity.

For the first version, prefer a straightforward content-first architecture, such as MDX files or another maintainable content solution.

Keep the content layer sufficiently decoupled so a headless CMS or database-backed editorial system can be introduced later without rewriting the entire frontend.

---

# 8. TECHNICAL EXPECTATIONS

Preferred initial direction: Next.js with App Router, React, TypeScript, Tailwind CSS, MDX or an equivalent structured content approach, Lucide icons where necessary, responsive layouts, static generation or server rendering where appropriate, deployment compatible with Vercel.

Alternatives may be proposed if there is a strong technical reason.

Do not introduce a database, authentication, user accounts, comments, payment systems or a complex CMS just to make the first version appear more sophisticated.

The initial objective is a beautiful and functional publication website.

The architecture should nevertheless allow a future editorial administration interface.

## Engineering quality

- Keep components reusable and well organized.
- Use strong TypeScript typing.
- Avoid unnecessary dependencies.
- Use semantic HTML.
- Implement accessibility best practices.
- Optimize images.
- Implement proper metadata and SEO.
- Include Open Graph metadata for social sharing.
- Use clean and readable URLs.
- Include loading, empty and error states where applicable.
- Ensure the site works well on mobile, tablet and desktop.
- Avoid hardcoded article content inside presentation components.
- Provide clear setup and deployment instructions.

## SEO

Implement: unique title and description per page, Open Graph metadata, canonical URLs, sitemap, robots.txt, structured data appropriate to articles and authors, semantic heading hierarchy, descriptive image alt text.

The language of the publication is Brazilian Portuguese (pt-BR). All user-facing text must be in natural Brazilian Portuguese.

---

# 9. INITIAL VISUAL CONTENT

Do not invent published reviews or essays.

For the development preview, use clearly identified demonstration content and placeholder images.

If demonstration content is necessary, create a small number of fictional entries with an explicit development-only status.

Never allow those entries to appear as real published content in production.

Create an empty state that looks intentional and editorially consistent.

The first launch may have only a few articles. The design must work beautifully with three publications just as well as with fifty.

---

# 10. INSTAGRAM INTEGRATION

Instagram is an important communication channel, but the website remains the primary publication.

Include: Instagram icon and link in the header or footer, social sharing on articles, Open Graph images suitable for sharing, a homepage invitation to follow the publication.

Do not build an Instagram API integration or automated social-media publishing system in the initial version.

Design article images and visual elements so that they can later be adapted to Instagram posts and carousels.

---

# 11. DEVELOPMENT WORKFLOW

Work in small, independently verifiable stages, and wait for approval at the end of each.

- **Stage 1 — Product and technical planning:** inspect the repository, propose architecture, page structure, design direction, minimum dependencies, assumptions. Ask only genuinely blocking questions.
- **Stage 2 — Visual foundation:** color tokens, typography, spacing, global layout, header, footer, text wordmark, responsive foundations, reusable article cards, basic components. Present a working visual preview.
- **Stage 3 — Complete website skeleton:** Home, Filmes, Livros, Séries, Duas Leituras, Ensaios, Sobre, article detail, with a structured content model and demonstration data. All pages interconnected.
- **Stage 4 — Content and editorial functionality:** author profiles, article metadata, related articles, companion navigation, spoiler warnings, search, SEO metadata, social sharing.
- **Stage 5 — Quality and deployment:** TypeScript checks, linting, build validation, responsive, accessibility, SEO and performance reviews, deployment instructions.
- **Stage 6 — Future enhancements (not now):** CMS, editorial dashboard, draft previews, rich-text editor, newsletter, analytics, automated Instagram content.

---

# 12. DESIGN QUALITY EXPECTATIONS

The final product should look like a real independent cultural magazine, not a generic template.

Pay special attention to: editorial hierarchy, typography, whitespace, article readability, image proportions, composition and balance, responsive behavior, consistency between homepage, archives and article pages.

Avoid: excessive rounded cards, generic SaaS dashboard aesthetics, gradient-heavy interfaces, overuse of shadows, excessive animations, large decorative icons, star ratings, generic stock imagery, excessively dense layouts.

Use subtle transitions only where they improve navigation or interaction. Sophisticated but approachable.

---

# 13. DEFINITION OF DONE

The first milestone is complete when:

1. The website can be started locally using documented instructions.
2. The homepage has the complete editorial structure.
3. All main sections are navigable.
4. Article detail pages work.
5. Articles have author attribution.
6. The Duas Leituras structure supports two independent perspectives.
7. The About page introduces the publication and its authors.
8. The design is responsive.
9. The visual identity is consistent.
10. The site is prepared for search engines and social sharing.
11. There are no broken routes or major console errors.
12. The project can be deployed.

Prioritize a polished, coherent and functional first version over architectural perfection.
