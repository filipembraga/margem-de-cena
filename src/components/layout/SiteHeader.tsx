import Link from 'next/link';

import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { getSectionsWithContent } from '@/content';
import {
  getInstagramUrl,
  primaryNavigation,
  siteConfig,
  withoutEmptySections,
  type NavigationItem,
} from '@/lib/site-config';

import { MobileMenu } from './MobileMenu';
import { NavigationLinks } from './NavigationLinks';
import { ThemeToggle } from './ThemeToggle';
import { Wordmark } from './Wordmark';

type SiteHeaderProps = {
  /**
   * `full`: the home page header (large wordmark, tagline, navigation row).
   * `compact`: inner pages (small wordmark and navigation on one line).
   * Both become the same mobile bar below 1024px.
   */
  variant: 'full' | 'compact';
};

const ICON_BUTTON_CLASS_NAMES =
  'inline-flex size-11 items-center justify-center text-fg hover:text-accent';

/**
 * Search (/busca) arrives in Stage 4; its icon button returns to the header with it.
 */
export async function SiteHeader({ variant }: SiteHeaderProps) {
  const instagramUrl = siteConfig.instagramHandle
    ? getInstagramUrl(siteConfig.instagramHandle)
    : null;
  const navigationItems = withoutEmptySections(primaryNavigation, await getSectionsWithContent());

  return (
    <header className="border-b border-fg">
      <MobileBar items={navigationItems} instagramUrl={instagramUrl} />
      {variant === 'full' ? (
        <FullDesktopHeader items={navigationItems} instagramUrl={instagramUrl} />
      ) : (
        <CompactDesktopHeader items={navigationItems} />
      )}
    </header>
  );
}

type HeaderPartProps = {
  items: NavigationItem[];
  instagramUrl: string | null;
};

function HomeLink({ size }: { size: 'header' | 'compact' }) {
  return (
    <Link href="/" aria-label="Margem de Cena — página inicial" className="inline-flex">
      <Wordmark size={size} />
    </Link>
  );
}

function InstagramLink({ url }: { url: string }) {
  return (
    <a
      href={url}
      aria-label="Instagram da Margem de Cena"
      rel="noopener noreferrer"
      target="_blank"
      className={ICON_BUTTON_CLASS_NAMES}
    >
      <InstagramIcon />
    </a>
  );
}

function MobileBar({ items, instagramUrl }: HeaderPartProps) {
  return (
    <div className="flex items-center justify-between py-2 pr-3 pl-5 lg:hidden">
      <HomeLink size="compact" />
      <MobileMenu items={items} instagramUrl={instagramUrl} />
    </div>
  );
}

function FullDesktopHeader({ items, instagramUrl }: HeaderPartProps) {
  return (
    <div className="page-container hidden flex-col gap-5.5 pt-7 pb-5 lg:flex">
      <div className="flex items-center justify-between gap-4">
        <HomeLink size="header" />
        <p className="font-display text-xl text-muted italic">{siteConfig.tagline}</p>
        <div className="flex gap-1">
          {instagramUrl && <InstagramLink url={instagramUrl} />}
          <ThemeToggle />
        </div>
      </div>
      <nav aria-label="Seções">
        <NavigationLinks
          items={items}
          listClassName="flex flex-wrap gap-7 type-nav"
          linkClassName="inline-block py-1"
        />
      </nav>
    </div>
  );
}

function CompactDesktopHeader({ items }: Pick<HeaderPartProps, 'items'>) {
  return (
    <div className="page-container hidden items-center justify-between gap-6 py-4 lg:flex">
      <HomeLink size="compact" />
      <div className="flex items-center gap-4">
        <nav aria-label="Seções">
          <NavigationLinks
            items={items}
            listClassName="flex flex-wrap gap-5.5 type-nav-compact"
            linkClassName="inline-block py-1"
          />
        </nav>
        <ThemeToggle />
      </div>
    </div>
  );
}
