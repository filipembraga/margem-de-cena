import { Cormorant_Garamond, Inter, Source_Serif_4 } from 'next/font/google';

/*
 * Self-hosted at build time by next/font, with metric-adjusted fallbacks to avoid layout
 * shift. The latin subset covers Portuguese diacritics. Each font exposes a CSS variable that
 * globals.css maps to the `font-display`, `font-reading` and `font-ui` utilities.
 */

/** Display: wordmark, titles, standfirst, quotes and margin notes. */
export const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant-garamond',
});

/** Reading: article body, excerpts and bios. Variable font with optical sizes. */
export const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-source-serif',
});

/** Interface: navigation, kickers, metadata, buttons and captions. */
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const fontVariableClassNames = [
  cormorantGaramond.variable,
  sourceSerif.variable,
  inter.variable,
].join(' ');
