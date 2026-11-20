import { ImageResponse } from 'next/og';
import type { ComponentProps } from 'react';

import { Monogram } from './Monogram';
import { loadOpenGraphFonts } from './open-graph-fonts';
import { OpenGraphCard, OPEN_GRAPH_IMAGE_SIZE } from './OpenGraphCard';

/** Renders the share card as a PNG, for the `opengraph-image` files of each route. */
export async function renderOpenGraphImage(
  card: ComponentProps<typeof OpenGraphCard>,
): Promise<ImageResponse> {
  return new ImageResponse(<OpenGraphCard {...card} />, {
    ...OPEN_GRAPH_IMAGE_SIZE,
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
