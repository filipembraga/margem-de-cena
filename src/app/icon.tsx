import { renderMonogramImage } from '@/components/og/render-open-graph-image';

const ICON_SIZE = 64;

export const size = { width: ICON_SIZE, height: ICON_SIZE };
export const contentType = 'image/png';

/** Browser tab icon: the "Mc" monogram. */
export default async function Icon() {
  return renderMonogramImage(ICON_SIZE);
}
