import { getTagPath, slugify } from '@/lib/slug';

import type { TagReference } from './types';

/** An article shows at most this many tags (docs/adr/0007-explicit-inline-tag-mentions.md). */
export const MAXIMUM_TAGS_PER_ARTICLE = 12;

/**
 * Builds an article's tag list: tags marked with `<Tag>` in the body first, in reading order,
 * then frontmatter tags that the body does not mention. Duplicates are merged by slug.
 */
export function buildArticleTags(
  bodyMentions: readonly string[],
  frontmatterTags: readonly string[],
): TagReference[] {
  const tagsBySlug = new Map<string, TagReference>();

  for (const name of [...bodyMentions, ...frontmatterTags]) {
    const slug = slugify(name);
    if (!tagsBySlug.has(slug)) {
      tagsBySlug.set(slug, { name, slug, path: getTagPath(name) });
    }
  }

  return [...tagsBySlug.values()];
}
