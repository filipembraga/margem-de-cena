import AxeBuilder from '@axe-core/playwright';

import { DESKTOP_BREAKPOINT, expect, PAGES, test } from '../helpers/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const THEMES = ['light', 'dark'] as const;

test.describe('accessibility (WCAG 2.2 A/AA)', () => {
  for (const { path, name } of PAGES) {
    for (const theme of THEMES) {
      test(`${name} has no violations in the ${theme} theme`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: theme });
        await page.goto(path);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

        const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

        expect(results.violations).toEqual([]);
      });
    }
  }

  test('the open mobile menu has no violations', async ({ page }) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) >= DESKTOP_BREAKPOINT,
      'The menu button exists only below 1024px.',
    );
    await page.goto('/');
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    expect(results.violations).toEqual([]);
  });
});
