import type { MetadataRoute } from 'next';

import { buildSitemap } from '@/components/seo/sitemap';
import { getAllTwoPerspectives, getAuthors, getPages, getPublishedArticles } from '@/content';
import { environment } from '@/lib/env';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, twoPerspectives, authors, pages] = await Promise.all([
    getPublishedArticles(),
    getAllTwoPerspectives(),
    getAuthors(),
    getPages(),
  ]);
  return buildSitemap({ articles, twoPerspectives, authors, pages }, environment.siteUrl);
}
