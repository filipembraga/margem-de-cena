/**
 * The boundary between where content is stored and how it is validated and queried.
 *
 * The filesystem implementation reads `content/`. A headless CMS would implement the same
 * interface (fetching at build time); schemas, integrity checks and queries stay the same.
 */

/** One unvalidated record, as stored. */
export type RawRecord = {
  slug: string;
  /** Where the record came from, used in validation messages (e.g. `content/articles/x.mdx`). */
  origin: string;
  /** Unvalidated frontmatter or YAML data. */
  data: unknown;
  /** MDX body, for articles and pages. Empty for data-only records. */
  body: string;
  /** True for records under `content/demo/`. */
  isDemo: boolean;
  /** Set when the stored data could not be read at all (for example, broken YAML). */
  syntaxError: string | null;
};

export type RawContent = {
  articles: RawRecord[];
  authors: RawRecord[];
  works: RawRecord[];
  twoPerspectives: RawRecord[];
  pages: RawRecord[];
};

export interface ContentSource {
  /** Loads every record. Demo records are included only when asked for. */
  load(options: { includeDemo: boolean }): Promise<RawContent>;
  /** Whether an image path (e.g. `/images/x.jpg`) points to an existing file. */
  imageExists(src: string): Promise<boolean>;
}
