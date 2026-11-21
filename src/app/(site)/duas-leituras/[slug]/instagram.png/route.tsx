import { notFound } from 'next/navigation';

import { renderShareImage } from '@/components/og/render-open-graph-image';
import { describeTwoPerspectivesShareCard } from '@/components/og/share-card-content';
import { getAllTwoPerspectives, getTwoPerspectives } from '@/content';

/**
 * The Duas Leituras card in the proportion of an Instagram post (4:5, 1080 × 1350):
 * `/duas-leituras/[slug]/instagram.png`. Same text as the link preview.
 */

export const dynamic = 'force-static';
export const dynamicParams = false;

type TwoPerspectivesInstagramImageContext = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const entries = await getAllTwoPerspectives();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function GET(_request: Request, { params }: TwoPerspectivesInstagramImageContext) {
  const entry = await getTwoPerspectives((await params).slug);
  if (!entry) {
    notFound();
  }

  return renderShareImage(describeTwoPerspectivesShareCard(entry), 'instagram-post');
}
