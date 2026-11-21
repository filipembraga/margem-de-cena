import { ImageResponse } from 'next/og';
import type { ComponentProps } from 'react';

import { Monogram } from './Monogram';
import { loadOpenGraphFonts } from './open-graph-fonts';
import {
  getShareCardSize,
  OpenGraphCard,
  type ShareCardContent,
  type ShareCardFormat,
} from './OpenGraphCard';

/** Renders the share card as a PNG, for the `opengraph-image` files of each route. */
export async function renderOpenGraphImage(
  card: ComponentProps<typeof OpenGraphCard>,
): Promise<ImageResponse> {
  return renderShareImage(card, card.format ?? 'link-preview');
}

/** Renders a share card in one format: the link preview or the Instagram post. */
export async function renderShareImage(
  content: ShareCardContent,
  format: ShareCardFormat,
): Promise<ImageResponse> {
  return new ImageResponse(<OpenGraphCard {...content} format={format} />, {
    ...getShareCardSize(format),
    fonts: await loadOpenGraphFonts(),
  });
}

/** Renders the monogram as a square PNG, for the favicon and the home screen icon. */
export async function renderMonogramImage(size: number): Promise<ImageResponse> {
  return new ImageResponse(<Monogram size={size} />, {
    width: size,
    height: size,
    fonts: await loadOpenGraphFonts(),
  });
}
