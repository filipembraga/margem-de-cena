# 0012. Instagram sharing through the system share sheet

- Status: Accepted
- Date: 2026-11-21

## Context

Instagram is the publication's main channel (brief §10), so readers should be able to take
an article to Instagram as easily as to WhatsApp or Threads. Those two, like e-mail, accept a
prefilled message in a URL (`wa.me/?text=…`, the Threads post intent, `mailto:`), which works
in any browser with a plain link.

Instagram offers no such URL. There is no web address that opens a new post or story with
an image or text filled in:

- Its official "share to Stories" integration is meant for native iOS and Android apps,
  through the app's URL scheme or intents, and needs a registered Meta app.
- Its publishing API posts only to the publication's own professional account, from a server,
  with an access token. It cannot share on a reader's behalf.

The brief also rules out an Instagram API integration in this version (§10).

## Decision

- **No Instagram link.** The share bar does not pretend to have one.
- **An "Instagram" button that uses the Web Share API with files.**
  - **When it appears:** only when `navigator.canShare({ files })` accepts an image, which
    today means mostly phone browsers.
  - **What it does:** shares the article's Stories image (`/[categoria]/[slug]/stories.png`,
    1080 × 1920, generated at build time) and the article link through the system share
    sheet, where the reader picks Instagram.
  - **Where files are not supported:** the button is not rendered at all, so nothing broken
    or disabled is shown.
- **No SDK, no Meta app, no tracking.** The site loads no third-party script.
- **Download ahead of the tap.** Browsers open the share sheet only shortly after a tap, so
  the image is downloaded when the share bar comes near the screen, and only in browsers
  that can share files.
- **Formats.** The Stories format keeps every line of text out of the top 250 px and the
  bottom 340 px, which the Stories interface covers. The post format (4:5, `/instagram.png`)
  stays available for the authors.

## Consequences

- Readers on phones share a branded image to Stories in two taps, without the site knowing
  anything about their Instagram account.
- Desktop readers do not see the button; Instagram on desktop has no share target anyway.
- Instagram may keep only the image and drop the link. A clickable link in Stories needs the
  link sticker, which the reader adds in Instagram (docs/como-publicar.md explains it).
- About 90 KB per article is downloaded ahead, only on devices that can share files and only
  when the reader scrolls near the share bar.
- If Instagram ever offers a web share URL, it can replace the button without changing the
  images.
