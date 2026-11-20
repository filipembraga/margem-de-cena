# 0010. Images in the article body, with dimensions read at build time

- Status: Accepted
- Date: 2026-11-20

## Context

The brief asks for images and captions inside articles. Every image needs pt-BR alt text, a
credit and a licence. `next/image` needs the intrinsic width and height to reserve space and
avoid layout shift, and images must keep their natural proportion: a book cover is 2:3, a
film still is wide. Asking authors to type pixel sizes would be error-prone.

## Decision

- Authors place images with `<Figure src alt caption credit license />` in its own
  paragraph. `src`, `alt`, `credit` and `license` are required; `caption` is optional.
  Markdown images (`![...](...)`) are rejected with a message that points to `<Figure>`.
- The MDX rules (ADR 0003) collect each figure's path. When the catalog loads, the content
  source reads the dimensions of every referenced image: covers, profile images and figures.
  A missing or unreadable file is a validation error with the file and line.
- `ContentSource.readImageSize(src)` replaces `imageExists(src)`. The filesystem source reads
  file headers with `image-size` (MIT, no dependencies); a CMS adapter would return the
  dimensions its API already provides.
- `ImageAsset` gains `width` and `height`, and each article body carries the sizes of its own
  figures, which `ArticleBody` hands to the `Figure` component.
- A figure is never wider than the reading column nor taller than 75% of the viewport, and
  keeps its proportion.

## Consequences

- Images render without layout shift, and a broken image path fails the build instead of
  showing a broken image.
- One small dependency (`image-size`) reads JPEG, PNG, WebP, AVIF and SVG headers.
