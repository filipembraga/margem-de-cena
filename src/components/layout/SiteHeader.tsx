import { Search } from 'lucide-react';
import Link from 'next/link';

import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { getInstagramUrl, primaryNavigation, siteConfig } from '@/lib/site-config';

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

export function SiteHeader({ variant }: SiteHeaderProps) {
  const instagramUrl = siteConfig.instagramHandle
    ? getInstagramUrl(siteConfig.instagramHandle)
    : null;

  return (
    <header className="border-b border-fg">
      <MobileBar instagramUrl={instagramUrl} />
      {variant === 'full' ? (
        <FullDesktopHeader instagramUrl={instagramUrl} />
      ) : (
        <CompactDesktopHeader />
      )}
    </header>
  );
}

function HomeLink({ size }: { size: 'header' | 'compact' }) {
  return (
    <Link href="/" aria-label="Margem de Cena — página inicial" className="inline-flex">
      <Wordmark size={size} />
    </Link>
  );
}

function SearchLink() {
  return (
    <Link href="/busca" aria-label="Buscar" className={ICON_BUTTON_CLASS_NAMES}>
      <Search aria-hidden="true" size={20} strokeWidth={1.6} />
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

function MobileBar({ instagramUrl }: { instagramUrl: string | null }) {
  return (
    <div className="flex items-center justify-between py-2 pr-3 pl-5 lg:hidden">
      <HomeLink size="compact" />
      <div className="flex">
        <SearchLink />
        <MobileMenu items={primaryNavigation} instagramUrl={instagramUrl} />
      </div>
    </div>
  );
}

function FullDesktopHeader({ instagramUrl }: { instagramUrl: string | null }) {
  return (
    <div className="page-container hidden flex-col gap-5.5 pt-7 pb-5 lg:flex">
      <div className="flex items-center justify-between gap-4">
        <HomeLink size="header" />
        <p className="font-display text-xl text-muted italic">{siteConfig.tagline}</p>
        <div className="flex gap-1">
          <SearchLink />
          {instagramUrl && <InstagramLink url={instagramUrl} />}
          <ThemeToggle />
        </div>
      </div>
      <nav aria-label="Seções">
        <NavigationLinks
          items={primaryNavigation}
          listClassName="flex flex-wrap gap-7 type-nav"
          linkClassName="inline-block py-1"
        />
      </nav>
    </div>
  );
}

function CompactDesktopHeader() {
  return (
    <div className="page-container hidden items-center justify-between gap-6 py-4 lg:flex">
      <HomeLink size="compact" />
      <div className="flex items-center gap-4">
        <nav aria-label="Seções">
          <NavigationLinks
            items={primaryNavigation}
            listClassName="flex flex-wrap gap-5.5 type-nav-compact"
            linkClassName="inline-block py-1"
          />
        </nav>
        <div className="flex">
          <SearchLink />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
