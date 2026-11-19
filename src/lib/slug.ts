/**
 * Turns a pt-BR label into an ASCII URL slug: "Memória" → "memoria",
 * "Alice Hoffman" → "alice-hoffman".
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Path of a tag page, e.g. `/tags/alice-hoffman` (docs/adr/0007-explicit-inline-tag-mentions.md). */
export function getTagPath(tagName: string): string {
  return `/tags/${slugify(tagName)}`;
}
