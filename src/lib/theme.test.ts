import { afterEach, describe, expect, it, vi } from 'vitest';

import { getThemeInitializationScript, initializeTheme, isTheme, THEME_STORAGE_KEY } from './theme';

type FakeBrowser = {
  root: { dataset: Record<string, string>; style: { colorScheme: string } };
  emitSystemChange: (prefersDark: boolean) => void;
};

function createFakeBrowser(options: {
  storedTheme?: string | null;
  systemPrefersDark?: boolean;
  storageThrows?: boolean;
}): FakeBrowser {
  const root = { dataset: {} as Record<string, string>, style: { colorScheme: '' } };
  let systemChangeListener: ((event: { matches: boolean }) => void) | undefined;

  vi.stubGlobal('document', { documentElement: root });
  vi.stubGlobal('window', {
    matchMedia: () => ({
      matches: options.systemPrefersDark ?? false,
      addEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => {
        systemChangeListener = listener;
      },
    }),
    localStorage: {
      getItem: (key: string) => {
        if (options.storageThrows) {
          throw new Error('Storage blocked');
        }
        return key === THEME_STORAGE_KEY ? (options.storedTheme ?? null) : null;
      },
    },
  });

  return {
    root,
    emitSystemChange: (prefersDark) => systemChangeListener?.({ matches: prefersDark }),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('initializeTheme', () => {
  it('uses the stored choice over the system preference', () => {
    const browser = createFakeBrowser({ storedTheme: 'light', systemPrefersDark: true });

    initializeTheme(THEME_STORAGE_KEY);

    expect(browser.root.dataset.theme).toBe('light');
    expect(browser.root.style.colorScheme).toBe('light');
  });

  it('follows the system preference when nothing is stored', () => {
    const browser = createFakeBrowser({ storedTheme: null, systemPrefersDark: true });

    initializeTheme(THEME_STORAGE_KEY);

    expect(browser.root.dataset.theme).toBe('dark');
  });

  it('ignores an unknown stored value', () => {
    const browser = createFakeBrowser({ storedTheme: 'sepia', systemPrefersDark: false });

    initializeTheme(THEME_STORAGE_KEY);

    expect(browser.root.dataset.theme).toBe('light');
  });

  it('falls back to the system preference when storage is blocked', () => {
    const browser = createFakeBrowser({ storageThrows: true, systemPrefersDark: true });

    initializeTheme(THEME_STORAGE_KEY);

    expect(browser.root.dataset.theme).toBe('dark');
  });

  it('follows live system changes only without a stored choice', () => {
    const withoutChoice = createFakeBrowser({ storedTheme: null, systemPrefersDark: false });
    initializeTheme(THEME_STORAGE_KEY);

    withoutChoice.emitSystemChange(true);

    expect(withoutChoice.root.dataset.theme).toBe('dark');

    const withChoice = createFakeBrowser({ storedTheme: 'light', systemPrefersDark: false });
    initializeTheme(THEME_STORAGE_KEY);

    withChoice.emitSystemChange(true);

    expect(withChoice.root.dataset.theme).toBe('light');
  });
});

describe('getThemeInitializationScript', () => {
  it('produces a self-invoking script bound to the storage key', () => {
    const script = getThemeInitializationScript();

    expect(script).toContain(JSON.stringify(THEME_STORAGE_KEY));
    expect(() => new Function(script)).not.toThrow();
  });
});

describe('isTheme', () => {
  it('accepts only the two supported themes', () => {
    expect(isTheme('dark')).toBe(true);
    expect(isTheme('light')).toBe(true);
    expect(isTheme('system')).toBe(false);
    expect(isTheme(undefined)).toBe(false);
  });
});
