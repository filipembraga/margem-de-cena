'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { classNames } from '@/lib/class-names';
import type { NavigationItem } from '@/lib/site-config';

type NavigationLinksProps = {
  items: NavigationItem[];
  listClassName?: string;
  linkClassName?: string;
  onNavigate?: () => void;
};

type ActiveState = 'page' | 'section' | 'none';

/** "page" on the item's own URL, "section" anywhere below it (e.g. an article in /filmes). */
function getActiveState(pathname: string, href: string): ActiveState {
  if (pathname === href) {
    return 'page';
  }
  if (pathname.startsWith(`${href}/`)) {
    return 'section';
  }
  return 'none';
}

const ARIA_CURRENT_BY_STATE = {
  page: 'page',
  section: 'true',
  none: undefined,
} as const;

/**
 * Section links with the current section highlighted in accent. A client component only
 * because it needs the current path.
 */
export function NavigationLinks({
  items,
  listClassName,
  linkClassName,
  onNavigate,
}: NavigationLinksProps) {
  const pathname = usePathname();

  return (
    <ul className={listClassName}>
      {items.map((item) => {
        const activeState = getActiveState(pathname, item.href);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={ARIA_CURRENT_BY_STATE[activeState]}
              onClick={onNavigate}
              className={classNames(
                'hover:text-accent',
                activeState === 'none' ? 'text-fg' : 'text-accent',
                linkClassName,
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
