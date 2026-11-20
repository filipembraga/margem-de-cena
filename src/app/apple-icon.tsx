import { renderMonogramImage } from '@/components/og/render-open-graph-image';

const APPLE_ICON_SIZE = 180;

export const size = { width: APPLE_ICON_SIZE, height: APPLE_ICON_SIZE };
export const contentType = 'image/png';

/** Home screen icon on iOS: the "Mc" monogram. */
export default async function AppleIcon() {
  return renderMonogramImage(APPLE_ICON_SIZE);
}
