'use client';

import { useCallback, useSyncExternalStore } from 'react';

import { applyThemeToDocument, isTheme, THEME_STORAGE_KEY, type Theme } from '@/lib/theme';

/** Re-renders subscribers whenever the `data-theme` attribute on `<html>` changes. */
function subscribeToThemeChanges(onThemeChange: () => void): () => void {
  const observer = new MutationObserver(onThemeChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function readCurrentTheme(): Theme {
  const currentTheme = document.documentElement.dataset.theme;
  return isTheme(currentTheme) ? currentTheme : 'light';
}

/** The server cannot know the visitor's theme; `null` means "not resolved yet". */
function readThemeOnServer(): null {
  return null;
}

type UseThemeResult = {
  /** Current theme, or `null` during server rendering and hydration. */
  theme: Theme | null;
  toggleTheme: () => void;
};

/** Reads the theme resolved by the inline script and switches it on demand. */
export function useTheme(): UseThemeResult {
  const theme = useSyncExternalStore(subscribeToThemeChanges, readCurrentTheme, readThemeOnServer);

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = readCurrentTheme() === 'dark' ? 'light' : 'dark';
    applyThemeToDocument(nextTheme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Storage can be blocked. The choice then lasts only for this page view, which is fine.
    }
  }, []);

  return { theme, toggleTheme };
}
