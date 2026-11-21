import { notFound } from 'next/navigation';

import { renderShareImage } from '@/components/og/render-open-graph-image';
import { describeTwoPerspectivesShareCard } from '@/components/og/share-card-content';
import { getAllTwoPerspectives, getTwoPerspectives } from '@/content';

/**
 * The Duas Leituras card in the proportion of Instagram Stories (9:16, 1080 × 1920):
 * `/duas-leituras/[slug]/stories.png`. Same text as the link preview.
 */

export const dynamic = 'force-static';
export const dynamicParams = false;

type TwoPerspectivesStoriesImageContext = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const entries = await getAllTwoPerspectives();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function GET(_request: Request, { params }: TwoPerspectivesStoriesImageContext) {
  const entry = await getTwoPerspectives((await params).slug);
  if (!entry) {
    notFound();
  }

  return renderShareImage(describeTwoPerspectivesShareCard(entry), 'instagram-story');
}
