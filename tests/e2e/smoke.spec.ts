import type { Page } from '@playwright/test';

import { DESKTOP_BREAKPOINT, expect, PAGES, test } from '../helpers/test';

test.describe('pages', () => {
  for (const { path, name } of PAGES) {
    test(`renders the ${name} with one h1 and no horizontal scroll`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');

      const horizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(horizontalOverflow).toBe(0);
    });
  }
});

test.describe('links', () => {
  test('every internal link on every page leads to an existing page', async ({ page, request }) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) < DESKTOP_BREAKPOINT,
      'Links are the same at every width; checking once is enough.',
    );
    const internalPaths = new Set<string>();

    for (const { path } of PAGES) {
      await page.goto(path);
      const hrefs = await page
        .locator('a[href^="/"]')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
      hrefs.forEach((href) => internalPaths.add(href.split('#')[0] ?? href));
    }

    for (const path of internalPaths) {
      const response = await request.get(path);
      expect(response.status(), `${path} should exist`).toBe(200);
    }
  });

  test('a Duas Leituras article links to the other reading', async ({ page }) => {
    await page.goto('/filmes/a-mare-que-nao-volta');

    await page.getByRole('link', { name: 'O que a gente deixa nos cômodos' }).click();

    await expect(page).toHaveURL('/filmes/o-que-a-gente-deixa-nos-comodos');
    await expect(page.getByRole('link', { name: 'A maré que não volta' })).toBeVisible();
  });

  test('an inline tag mention opens the tag page', async ({ page }) => {
    await page.goto('/filmes/a-mare-que-nao-volta');

    await page
      .getByRole('article')
      .getByRole('link', { name: 'memória', exact: true })
      .first()
      .click();

    await expect(page).toHaveURL('/tags/memoria');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('memória');
  });
});

test.describe('not found', () => {
  const UNKNOWN_PATH = '/endereco-que-nao-existe';
  const UNKNOWN_ARTICLE_PATH = '/filmes/texto-que-nao-existe';
  test.use({ expectedFailedPaths: [UNKNOWN_PATH, UNKNOWN_ARTICLE_PATH] });

  test('answers an unknown article slug with a real 404', async ({ page }) => {
    const response = await page.goto(UNKNOWN_ARTICLE_PATH);

    expect(response?.status()).toBe(404);
  });

  test('answers an unknown address with the pt-BR 404 page', async ({ page }) => {
    const response = await page.goto(UNKNOWN_PATH);

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Esta página não existe, ou ainda não foi escrita.',
    );
    await expect(page.getByRole('link', { name: 'Ir para a página inicial' })).toBeVisible();
  });
});

test.describe('keyboard', () => {
  test('starts with a skip link that moves focus to the main content', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Pular para o conteúdo' });
    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  });
});

test.describe('theme', () => {
  test('follows the system preference before the first paint', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await recordThemeWhenBodyAppears(page);

    await page.goto('/');

    expect(await page.evaluate(() => window.__themeWhenBodyAppeared)).toBe('dark');
  });

  test('prefers the stored choice over the system preference', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.addInitScript(() => window.localStorage.setItem('margem-de-cena:theme', 'light'));
    await recordThemeWhenBodyAppears(page);

    await page.goto('/');

    expect(await page.evaluate(() => window.__themeWhenBodyAppeared)).toBe('light');
  });

  test('toggles and keeps the choice after a reload', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await openThemeControls(page);

    await page.getByRole('button', { name: 'Ativar tema escuro' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});

test.describe('mobile menu', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) >= DESKTOP_BREAKPOINT,
      'The menu button exists only below 1024px.',
    );
    await page.goto('/');
  });

  test('opens the navigation panel and closes it with Escape', async ({ page }) => {
    const menuButton = page.getByRole('button', { name: 'Abrir menu' });

    await menuButton.click();
    const menu = page.getByRole('dialog', { name: 'Menu' });
    await expect(menu).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(menu.getByRole('link', { name: 'Duas Leituras' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(menuButton).toBeFocused();
  });

  test('closes with the close button', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir menu' }).click();

    await page.getByRole('button', { name: 'Fechar menu' }).click();

    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden();
  });
});

declare global {
  interface Window {
    __themeWhenBodyAppeared?: string;
  }
}

/**
 * Records `data-theme` at the moment `<body>` is inserted, before anything can be painted.
 * This proves the inline script resolves the theme early enough to avoid a flash.
 */
async function recordThemeWhenBodyAppears(page: Page): Promise<void> {
  await page.addInitScript(() => {
    // Init scripts run before <html> exists, so watch the whole document as it is parsed.
    const observer = new MutationObserver(() => {
      if (document.body) {
        window.__themeWhenBodyAppeared = document.documentElement.dataset.theme;
        observer.disconnect();
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  });
}

/** On small screens the theme toggle lives inside the mobile menu. */
async function openThemeControls(page: Page): Promise<void> {
  if ((page.viewportSize()?.width ?? 0) < DESKTOP_BREAKPOINT) {
    await page.getByRole('button', { name: 'Abrir menu' }).click();
  }
}
