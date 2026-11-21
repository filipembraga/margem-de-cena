# Quality review: performance, accessibility and SEO

- **Date:** 2026-11-21 (Stage 5)
- **Tool:** Lighthouse 13.6.0, mobile preset (simulated slow 4G and a mid-range phone CPU)
- **Server:** `next start` on a local production build
- **Builds:**
  - the article is measured on a build with demonstration content, since production has no
    articles yet;
  - the home page is measured on both builds;
  - SEO is read from a build with `VERCEL_ENV=production`, the only one search engines may
    index.

## Lighthouse scores

| Page | Build | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- | --- |
| Home (`/`) | production | 100 | 100 | 100 | 100 |
| Sobre (`/sobre`) | production | 100 | 100 | 100 | 100 |
| Home (`/`) | demo | 100 | 100 | 100 | 66¹ |
| Article (`/filmes/a-mare-que-nao-volta`) | demo | 99 | 100 | 100 | 66¹ |

¹ The only failing SEO audit is "page is blocked from indexing". Builds that are not
production are `noindex` on purpose (ADR 0004). The other eight SEO audits pass.

### Core metrics (mobile, demo build)

| Page | FCP | LCP | TBT | CLS | Speed Index |
| --- | --- | --- | --- | --- | --- |
| Home | 0.8 s | 0.8 s | 50 ms | 0 | 1.1 s |
| Article | 0.9 s | 0.9 s | 100 ms | 0 | 0.9 s |

## Findings

### Performance

| Finding | Verdict |
| --- | --- |
| One render-blocking stylesheet (8.8 KB), about 150 ms in the simulation | **Kept.** Inlining CSS needs an experimental Next.js flag and would give up caching between pages, for 150 ms on a first paint that is already at 0.8 s. |
| 28 KB of unused JavaScript and 14 KB of legacy polyfills (`Array.prototype.at`, `Object.hasOwn`…) | **Kept.** Both come from the Next.js framework chunk, not from site code. Only the theme toggle, spoiler, menu, share bar and search input ship JavaScript of their own. |
| Time to Interactive 4.4 s in the simulation | **Kept.** Lighthouse no longer counts this metric; Total Blocking Time, which it does count, is 50 to 100 ms. |
| Back/forward cache not restored | **Not actionable.** Lighthouse reports the cause as memory pressure in the test browser, not something the page does. |
| No layout shift (CLS 0) | Fonts are self-hosted by `next/font`, and every image has its dimensions from the build (ADR 0010). |

### Accessibility

axe (WCAG 2.2 A/AA) runs in CI on every page template, in both themes, at 360, 768 and
1280 px, and fails on any violation of any impact, not only serious ones. It reports none. The
manual review also confirmed:

- a skip link, visible focus and keyboard access throughout;
- the mobile menu closes with Escape and returns focus to its button;
- the spoiler button sets `aria-expanded`, and the hidden passage is not read by screen readers;
- the share bar announces "Link copiado" through a live region;
- `prefers-reduced-motion` turns transitions off;
- contrast was computed for every token pair in both themes (docs/design-system.md).

### SEO

| Finding | Fix |
| --- | --- |
| The home page title was only "Margem de Cena", with nothing on what the site covers | **Fixed.** It is now "Margem de Cena: leituras de cinema, literatura e televisão" (`siteConfig.homeTitle`), also used in its share card. |
| The search page (`/busca`) was indexable. Internal search result pages are thin and have endless variations | **Fixed.** It is now `noindex`. The articles it finds are indexed on their own pages. |
| Hidden pages (styleguide, search, filtered archives) were `noindex, nofollow` | **Fixed.** On production they are now `noindex, follow`, so their links still help crawlers. Outside production everything stays `nofollow`. |
| The 404 page carries two `robots` tags: one added by Next.js and one of ours | **Kept on purpose.** Ours overrides the layout's `index, follow`; without it, production would send contradictory tags. Both say `noindex`. |

Already in place from Stage 4:

- canonical URLs on every page;
- Open Graph and Twitter cards, with generated share images;
- JSON-LD: `Article`, `ProfilePage`, `WebSite` and `BreadcrumbList`;
- a sitemap without demonstration content;
- `robots.txt` open only on production;
- `lang="pt-BR"` and `og:locale` `pt_BR`.

## Before launch

- Set `NEXT_PUBLIC_SITE_URL` to the final domain on Vercel, then rerun Lighthouse on the
  deployed home page and one published article.
- Replace every `[A PREENCHER: …]` text (`pnpm check:placeholders --strict`). Author bios are
  also used as meta descriptions.
- Add the publication's e-mail and Instagram handle to `src/lib/site-config.ts` once they
  exist.
