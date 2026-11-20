import type { Metadata } from 'next';

import { InstitutionalPage } from '@/components/layout/InstitutionalPage';
import { getPage } from '@/content';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('creditos');
  return buildPageMetadata({ title: page.title, description: page.description, path: '/creditos' });
}

export default async function CreditsPage() {
  return <InstitutionalPage page={await getPage('creditos')} />;
}
