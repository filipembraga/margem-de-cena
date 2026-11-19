'use client';

import { Moon, Sun } from 'lucide-react';

import { classNames } from '@/lib/class-names';

import { useTheme } from './use-theme';

type ThemeToggleProps = {
  /** Shows a text label next to the icon (used in the mobile menu). */
  withLabel?: boolean;
  className?: string;
};

function getActionLabel(theme: 'light' | 'dark' | null): string {
  if (theme === 'dark') {
    return 'Ativar tema claro';
  }
  if (theme === 'light') {
    return 'Ativar tema escuro';
  }
  return 'Alternar tema';
}

/**
 * Switches between light and dark. The icon is chosen by CSS from the `data-theme`
 * attribute, so it is already correct before React hydrates.
 */
export function ThemeToggle({ withLabel = false, className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const actionLabel = getActionLabel(theme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={withLabel ? undefined : actionLabel}
      className={classNames(
        'inline-flex min-h-11 min-w-11 items-center justify-center gap-3 text-fg hover:text-accent',
        className,
      )}
    >
      <Moon aria-hidden="true" size={20} strokeWidth={1.6} className="dark:hidden" />
      <Sun aria-hidden="true" size={20} strokeWidth={1.6} className="hidden dark:block" />
      {withLabel && <span className="type-meta">{actionLabel}</span>}
    </button>
  );
}
