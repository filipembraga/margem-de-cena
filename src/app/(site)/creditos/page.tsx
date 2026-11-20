import type { Metadata } from 'next';

import { InstitutionalPage } from '@/components/layout/InstitutionalPage';
import { getPage } from '@/content';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('creditos');
  return { title: page.title, description: page.description };
}

export default async function CreditsPage() {
  return <InstitutionalPage page={await getPage('creditos')} />;
}
