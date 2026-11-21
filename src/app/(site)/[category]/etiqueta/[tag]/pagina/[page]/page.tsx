import type { Metadata } from 'next';

import { buildArchiveMetadata } from '@/components/archive/archive-metadata';
import { CategoryArchive } from '@/components/archive/CategoryArchive';
import {
  listArchiveRouteParams,
  readArchive,
  type ArchiveRouteParams,
} from '@/components/archive/read-archive';

type ArchivePageProps = {
  params: Promise<ArchiveRouteParams>;
};

export const dynamicParams = false;

export function generateStaticParams(): Promise<ArchiveRouteParams[]> {
  return listArchiveRouteParams({ isFiltered: true, isPaginated: true });
}

export async function generateMetadata({ params }: ArchivePageProps): Promise<Metadata> {
  return buildArchiveMetadata(await readArchive(await params));
}

/** Later pages of a category archive filtered by one tag. (docs/adr/0011) */
export default async function ArchivePage({ params }: ArchivePageProps) {
  return <CategoryArchive archive={await readArchive(await params)} />;
}
