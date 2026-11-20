import type { ContentSource, RawContent, RawRecord } from '../source';

/**
 * A `ContentSource` built from objects, for tests. It also shows how small a new source
 * (for example, a CMS adapter) can be.
 */

type RecordInput = Partial<Omit<RawRecord, 'slug'>> & { slug: string };

export type InMemoryContent = { [Collection in keyof RawContent]?: RecordInput[] };

function toRawRecord(collection: string, input: RecordInput): RawRecord {
  const folder = input.isDemo ? `content/demo/${collection}` : `content/${collection}`;
  return {
    origin: `${folder}/${input.slug}`,
    data: {},
    body: '',
    isDemo: false,
    syntaxError: null,
    ...input,
  };
}

export function createInMemorySource(
  content: InMemoryContent,
  existingImages: readonly string[] = [],
): ContentSource {
  return {
    async load({ includeDemo }): Promise<RawContent> {
      const collection = (name: keyof RawContent): RawRecord[] =>
        (content[name] ?? [])
          .map((input) => toRawRecord(name, input))
          .filter((record) => includeDemo || !record.isDemo);

      return {
        articles: collection('articles'),
        authors: collection('authors'),
        works: collection('works'),
        twoPerspectives: collection('twoPerspectives'),
        pages: collection('pages'),
      };
    },
    async imageExists(src: string): Promise<boolean> {
      return existingImages.includes(src);
    },
  };
}
