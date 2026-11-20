import { OPEN_GRAPH_IMAGE_SIZE } from '@/components/og/OpenGraphCard';
import { renderOpenGraphImage } from '@/components/og/render-open-graph-image';
import { siteConfig } from '@/lib/site-config';

/** The share card of the home page and of every page without a card of its own. */

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = OPEN_GRAPH_IMAGE_SIZE;
export const contentType = 'image/png';

export default async function SiteOpenGraphImage() {
  return renderOpenGraphImage({
    title: siteConfig.tagline,
    footer: siteConfig.coverageLine,
    isTitleItalic: true,
  });
}
