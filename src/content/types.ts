import type { Category, ContentSection } from '@/lib/categories';
import type { PlainDate } from '@/lib/dates';

/**
 * Domain types returned by the content layer's queries. Pages and components depend on these,
 * never on raw frontmatter, so the source of the content can change without touching the UI.
 */

export type ImageAsset = {
  /** Path under `public/`, e.g. `/images/articles/a-casa.jpg`. */
  src: string;
  /** pt-BR description of the image. */
  alt: string;
  credit: string;
  license: string;
};

export type AuthorReference = {
  slug: string;
  name: string;
  path: string;
};

export type Author = AuthorReference & {
  shortBio: string;
  fullBio: string;
  profileImage: ImageAsset | null;
  /** Instagram handle without "@". */
  instagramHandle: string | null;
};

type WorkBase = {
  slug: string;
  title: string;
  originalTitle: string | null;
  year: number | null;
  genre: string | null;
  cover: ImageAsset | null;
  isDemo: boolean;
};

export type FilmWork = WorkBase & {
  category: 'film';
  directors: string[];
  runtimeInMinutes: number | null;
};

export type BookWork = WorkBase & {
  category: 'book';
  originalAuthors: string[];
  publisher: string | null;
  translator: string | null;
  edition: string | null;
};

export type SeriesWork = WorkBase & {
  category: 'series';
  creators: string[];
  platform: string | null;
  seasons: number | null;
};

/** A film, book or series that one or more articles discuss. Essays have no work. */
export type Work = FilmWork | BookWork | SeriesWork;

export type TagReference = {
  /** Canonical spelling, as the author wrote it. */
  name: string;
  slug: string;
  path: string;
};

/** Everything a listing needs. Carries no body, so listings never touch compiled MDX. */
export type ArticleSummary = {
  slug: string;
  path: string;
  category: Category;
  title: string;
  subtitle: string | null;
  excerpt: string;
  authors: AuthorReference[];
  publishedAt: PlainDate;
  updatedAt: PlainDate | null;
  readingTimeInMinutes: number;
  cover: ImageAsset | null;
  work: Work | null;
  tags: TagReference[];
  isFeatured: boolean;
  hasSpoilerWarning: boolean;
  /** Demonstration content, visible only when SHOW_DEMO_CONTENT=true. */
  isDemo: boolean;
  /** Slug of the Duas Leituras entry this article belongs to, if any. */
  twoPerspectivesSlug: string | null;
};

/**
 * The article body. Only `ArticleBody` knows how to render it, so a CMS with another body
 * format adds a variant here and a renderer there.
 */
export type ArticleBodyContent = {
  format: 'mdx';
  /** Output of the MDX compiler (`function-body` format), run at render time. */
  compiledCode: string;
};

export type Article = ArticleSummary & {
  body: ArticleBodyContent;
  references: string[];
};

export type Perspective = {
  /** 1 for Leitura I, 2 for Leitura II. */
  position: 1 | 2;
  article: ArticleSummary;
};

/** One work read by both authors in two independent articles. */
export type TwoPerspectives = {
  slug: string;
  path: string;
  work: Work;
  introduction: string;
  perspectives: [Perspective, Perspective];
  /** Date of the most recent of the two articles. */
  publishedAt: PlainDate;
  isDemo: boolean;
};

export type PageSlug = 'sobre' | 'contato' | 'privacidade' | 'creditos';

/** An institutional page written in MDX (Sobre, Contato, Privacidade, Créditos). */
export type Page = {
  slug: PageSlug;
  title: string;
  description: string;
  body: ArticleBodyContent;
};

/** Sections that can be empty, and are hidden from navigation and the home page when they are. */
export type Section = ContentSection;
