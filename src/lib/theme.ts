/**
 * Light and dark theme handling (docs/adr/0005-theme-switching-without-a-library.md).
 *
 * The theme is resolved by a small inline script before the first paint, so the page never
 * flashes the wrong colors. React only reads and changes the result afterwards.
 */

export const THEMES = ['light', 'dark'] as const;

export type Theme = (typeof THEMES)[number];

/** localStorage key for an explicit choice made with the theme toggle. */
export const THEME_STORAGE_KEY = 'margem-de-cena:theme';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

/** Applies a theme to the document. Shared by the inline script and the toggle. */
export function applyThemeToDocument(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

/**
 * Runs in the browser before the first paint, inlined in the root layout's `<head>`.
 * It must stay self-contained: it is serialized with `toString()`, so it cannot use imports
 * or variables from this module.
 */
export function initializeTheme(storageKey: string): void {
  const root = document.documentElement;
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function readStoredTheme(): 'light' | 'dark' | null {
    try {
      const storedTheme = window.localStorage.getItem(storageKey);
      return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : null;
    } catch {
      // Storage can be blocked (private mode, strict settings). The system preference applies.
      return null;
    }
  }

  function applyTheme(theme: 'light' | 'dark'): void {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  }

  applyTheme(readStoredTheme() ?? (systemPrefersDark.matches ? 'dark' : 'light'));

  // Without an explicit choice, follow the system when it changes while the page is open.
  systemPrefersDark.addEventListener('change', (event) => {
    if (readStoredTheme() === null) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  });
}

/** Source of the inline script, ready for `dangerouslySetInnerHTML`. */
export function getThemeInitializationScript(): string {
  return `(${initializeTheme.toString()})(${JSON.stringify(THEME_STORAGE_KEY)});`;
}
