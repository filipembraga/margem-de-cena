import type { Metadata } from 'next';

import { InstitutionalPage } from '@/components/layout/InstitutionalPage';
import { getPage } from '@/content';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('privacidade');
  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: '/privacidade',
  });
}

export default async function PrivacyPage() {
  return <InstitutionalPage page={await getPage('privacidade')} />;
}
