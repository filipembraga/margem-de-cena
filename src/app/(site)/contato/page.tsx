import type { Metadata } from 'next';

import { InstitutionalPage } from '@/components/layout/InstitutionalPage';
import { getPage } from '@/content';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('contato');
  return buildPageMetadata({ title: page.title, description: page.description, path: '/contato' });
}

export default async function ContactPage() {
  return <InstitutionalPage page={await getPage('contato')} />;
}
