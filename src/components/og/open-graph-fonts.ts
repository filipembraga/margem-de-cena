import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Fonts for the Open Graph images. `next/og` reads TTF, OTF and WOFF, but not the WOFF2 files
 * `next/font` serves, so the same families come from the Fontsource packages (OFL licence).
 * Only the latin subset is needed for pt-BR. Images are generated at build time.
 */

type FontWeight = 400 | 500 | 600;
type FontStyle = 'normal' | 'italic';

export type OpenGraphFont = {
  name: string;
  data: Buffer;
  weight: FontWeight;
  style: FontStyle;
};

type FontFile = Omit<OpenGraphFont, 'data'> & { packageFile: string };

export const DISPLAY_FONT_FAMILY = 'Cormorant Garamond';
export const INTERFACE_FONT_FAMILY = 'Inter';

const FONT_FILES: FontFile[] = [
  {
    name: DISPLAY_FONT_FAMILY,
    weight: 500,
    style: 'normal',
    packageFile: '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff',
  },
  {
    name: DISPLAY_FONT_FAMILY,
    weight: 500,
    style: 'italic',
    packageFile: '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff',
  },
  {
    name: INTERFACE_FONT_FAMILY,
    weight: 400,
    style: 'normal',
    packageFile: '@fontsource/inter/files/inter-latin-400-normal.woff',
  },
  {
    name: INTERFACE_FONT_FAMILY,
    weight: 600,
    style: 'normal',
    packageFile: '@fontsource/inter/files/inter-latin-600-normal.woff',
  },
];

let loadedFonts: Promise<OpenGraphFont[]> | undefined;

/** Reads the font files once per build and shares them between every image. */
export function loadOpenGraphFonts(): Promise<OpenGraphFont[]> {
  loadedFonts ??= Promise.all(
    FONT_FILES.map(async ({ packageFile, ...font }) => ({
      ...font,
      data: await readFile(path.join(process.cwd(), 'node_modules', packageFile)),
    })),
  );
  return loadedFonts;
}
