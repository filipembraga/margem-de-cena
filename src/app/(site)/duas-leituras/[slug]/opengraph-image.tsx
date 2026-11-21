import { notFound } from 'next/navigation';

import { OPEN_GRAPH_IMAGE_SIZE } from '@/components/og/OpenGraphCard';
import { renderOpenGraphImage } from '@/components/og/render-open-graph-image';
import { describeTwoPerspectivesShareCard } from '@/components/og/share-card-content';
import { getAllTwoPerspectives, getTwoPerspectives } from '@/content';

/** A Duas Leituras share card: the work's title and the two authors who read it. */

export const alt = 'Título da obra e nomes de quem a leu, com a marca Margem de Cena.';
export const size = OPEN_GRAPH_IMAGE_SIZE;
export const contentType = 'image/png';

type TwoPerspectivesImageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const entries = await getAllTwoPerspectives();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export default async function TwoPerspectivesOpenGraphImage({ params }: TwoPerspectivesImageProps) {
  const entry = await getTwoPerspectives((await params).slug);
  if (!entry) {
    notFound();
  }

  return renderOpenGraphImage(describeTwoPerspectivesShareCard(entry));
}
