import {
  getCategoryDefinition,
  getCategoryPath,
  type Category,
  type ContentSection,
} from './categories';

export type NavigationItem = {
  label: string;
  href: string;
  /** Set when the item lists content, so the item is hidden while the section is empty. */
  section?: ContentSection;
};

export type SiteConfig = {
  name: string;
  /** Title of the home page in search results and share cards: the name and what it covers. */
  homeTitle: string;
  tagline: string;
  description: string;
  /** Short line shown in the top strip of the home page. */
  coverageLine: string;
  /** Placeholder until the authors provide a contact address. */
  contactEmail: string | null;
  /**
   * Publication's own Instagram handle, without "@". While it is not set, the header has no
   * Instagram link and the home page invites readers to follow the authors instead.
   */
  instagramHandle: string | null;
};

export const siteConfig: SiteConfig = {
  name: 'Margem de Cena',
  homeTitle: 'Margem de Cena: leituras de cinema, literatura e televisão',
  tagline: 'Histórias que permanecem. Leituras que se encontram.',
  description:
    'Publicação cultural independente sobre cinema, literatura e televisão: leituras, ensaios e duas perspectivas sobre a mesma obra.',
  coverageLine: 'Cinema · Literatura · Televisão',
  contactEmail: null,
  instagramHandle: null,
};

function categoryNavigationItem(category: Category): NavigationItem {
  return {
    label: getCategoryDefinition(category).pluralLabel,
    href: getCategoryPath(category),
    section: category,
  };
}

/** Main sections, in the order of the approved header. */
export const primaryNavigation: NavigationItem[] = [
  categoryNavigationItem('film'),
  categoryNavigationItem('book'),
  categoryNavigationItem('series'),
  { label: 'Duas Leituras', href: '/duas-leituras', section: 'two-perspectives' },
  categoryNavigationItem('essay'),
  { label: 'Sobre', href: '/sobre' },
];

/** Footer adds the institutional pages to the main sections. */
export const footerNavigation: NavigationItem[] = [
  ...primaryNavigation,
  { label: 'Contato', href: '/contato' },
  { label: 'Privacidade', href: '/privacidade' },
  { label: 'Créditos', href: '/creditos' },
];

/** Leaves out the items of sections that have nothing published yet. */
export function withoutEmptySections(
  items: NavigationItem[],
  sectionsWithContent: ReadonlySet<ContentSection>,
): NavigationItem[] {
  return items.filter(
    (item) => item.section === undefined || sectionsWithContent.has(item.section),
  );
}

/** Builds the public Instagram profile URL from a handle. */
export function getInstagramUrl(handle: string): string {
  return `https://www.instagram.com/${handle}/`;
}
