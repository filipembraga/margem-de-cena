'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

import { InstagramIcon } from '@/components/ui/InstagramIcon';
import type { NavigationItem } from '@/lib/site-config';

import { NavigationLinks } from './NavigationLinks';
import { ThemeToggle } from './ThemeToggle';
import { Wordmark } from './Wordmark';

type MobileMenuProps = {
  items: NavigationItem[];
  instagramUrl: string | null;
};

/**
 * Full-height navigation panel for small screens. Built on the native modal `<dialog>`, which
 * already traps focus, closes on Escape and makes the rest of the page inert.
 */
export function MobileMenu({ items, instagramUrl }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dialogId = useId();
  const pathname = usePathname();

  function openMenu() {
    dialogRef.current?.showModal();
    setIsOpen(true);
  }

  function closeMenu() {
    dialogRef.current?.close();
  }

  // Close the panel when navigation changes the page (including browser back/forward).
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={openMenu}
        aria-label="Abrir menu"
        aria-expanded={isOpen}
        aria-controls={dialogId}
        className="inline-flex size-11 items-center justify-center text-fg hover:text-accent"
      >
        <Menu aria-hidden="true" size={22} strokeWidth={1.6} />
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-label="Menu"
        onClose={() => setIsOpen(false)}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-fg backdrop:bg-transparent"
      >
        <div className="flex min-h-full flex-col">
          <div className="flex items-center justify-between border-b border-fg py-2 pr-3 pl-5">
            <Link href="/" aria-label="Margem de Cena — página inicial" onClick={closeMenu}>
              <Wordmark size="compact" />
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Fechar menu"
              className="inline-flex size-11 items-center justify-center text-fg hover:text-accent"
            >
              <X aria-hidden="true" size={22} strokeWidth={1.6} />
            </button>
          </div>

          <nav aria-label="Seções" className="flex-1 px-5 py-8">
            <NavigationLinks
              items={items}
              onNavigate={closeMenu}
              listClassName="flex flex-col"
              linkClassName="block border-b border-line py-3 font-display text-[2rem] leading-tight font-medium"
            />
          </nav>

          <div className="flex items-center justify-between gap-4 border-t border-line px-3 py-3">
            <ThemeToggle withLabel className="px-2" />
            {instagramUrl && (
              <a
                href={instagramUrl}
                rel="noopener noreferrer"
                target="_blank"
                className="inline-flex min-h-11 items-center gap-3 px-2 text-fg hover:text-accent"
              >
                <InstagramIcon />
                <span className="type-meta">Instagram</span>
              </a>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
