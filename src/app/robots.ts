import type { MetadataRoute } from 'next';

import { environment } from '@/lib/env';
import { toAbsoluteUrl } from '@/lib/seo';

/**
 * Only the production deployment is open to search engines; previews and local builds ask
 * every crawler to stay out, matching the `robots` meta tag of the root layout (ADR 0004).
 */
export default function robots(): MetadataRoute.Robots {
  if (!environment.isVercelProduction) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: toAbsoluteUrl('/sitemap.xml'),
  };
}
