import type { Metadata } from 'next';

import { buildArchiveMetadata } from '@/components/archive/archive-metadata';
import { CategoryArchive } from '@/components/archive/CategoryArchive';
import { readArchive, type ArchiveRouteParams } from '@/components/archive/read-archive';
import { CATEGORIES, getCategoryDefinition } from '@/lib/categories';

type CategoryPageProps = {
  params: Promise<ArchiveRouteParams>;
};

/** Only the four category slugs exist; anything else is a real 404. */
export const dynamicParams = false;

export function generateStaticParams(): Array<{ category: string }> {
  return CATEGORIES.map((category) => ({ category: getCategoryDefinition(category).slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  return buildArchiveMetadata(await readArchive(await params));
}

/** First page of a category archive: the most recent articles (docs/adr/0011). */
export default async function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryArchive archive={await readArchive(await params)} />;
}
