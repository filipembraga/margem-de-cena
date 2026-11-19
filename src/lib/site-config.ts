import { getCategoryDefinition, getCategoryPath, type Category } from './categories';

export type NavigationItem = {
  label: string;
  href: string;
  /** Set when the item belongs to a category, so empty sections can be hidden later. */
  category?: Category;
};

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  /** Short line shown in the top strip of the home page. */
  coverageLine: string;
  /** Placeholder until the authors provide a contact address. */
  contactEmail: string | null;
  /** Publication's own Instagram handle, without "@". Hidden while not set. */
  instagramHandle: string | null;
};

export const siteConfig: SiteConfig = {
  name: 'Margem de Cena',
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
    category,
  };
}

/** Main sections, in the order of the approved header. */
export const primaryNavigation: NavigationItem[] = [
  categoryNavigationItem('film'),
  categoryNavigationItem('book'),
  categoryNavigationItem('series'),
  { label: 'Duas Leituras', href: '/duas-leituras' },
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

/** Builds the public Instagram profile URL from a handle. */
export function getInstagramUrl(handle: string): string {
  return `https://www.instagram.com/${handle}/`;
}
