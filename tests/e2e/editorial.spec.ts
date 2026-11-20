import { DESKTOP_BREAKPOINT, expect, test } from '../helpers/test';

const ARTICLE_PATH = '/filmes/a-mare-que-nao-volta';
const SPOILER_TEXT = 'No último plano, a câmera volta à cozinha da primeira cena.';

test.describe('spoiler', () => {
  test('keeps the passage hidden until the reader reveals it', async ({ page }) => {
    await page.goto(ARTICLE_PATH);
    const revealButton = page.getByRole('button', { name: 'Revelar trecho' });

    await expect(page.getByText(SPOILER_TEXT)).toBeHidden();
    await expect(revealButton).toHaveAttribute('aria-expanded', 'false');

    await revealButton.click();

    await expect(page.getByText(SPOILER_TEXT)).toBeVisible();
    const hideButton = page.getByRole('button', { name: 'Ocultar trecho' });
    await expect(hideButton).toHaveAttribute('aria-expanded', 'true');

    await hideButton.click();
    await expect(page.getByText(SPOILER_TEXT)).toBeHidden();
  });
});

test.describe('share bar', () => {
  test('copies the article link and announces it', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(ARTICLE_PATH);
    const shareBar = page.getByRole('region', { name: 'Compartilhar' });

    await shareBar.getByRole('button', { name: 'Copiar link' }).click();

    await expect(shareBar.getByRole('status')).toHaveText('Link copiado.');
    await expect(shareBar.getByRole('button', { name: 'Link copiado' })).toBeVisible();
    const copiedText = await page.evaluate(() => navigator.clipboard.readText());
    expect(new URL(copiedText).pathname).toBe(ARTICLE_PATH);
  });

  test('links to WhatsApp with the title and the address', async ({ page }) => {
    await page.goto(ARTICLE_PATH);

    const whatsAppLink = page.getByRole('link', { name: /WhatsApp/ });

    const href = (await whatsAppLink.getAttribute('href')) ?? '';
    const message = new URL(href).searchParams.get('text') ?? '';
    expect(message).toContain('A maré que não volta');
    expect(message).toContain(ARTICLE_PATH);
  });
});

test.describe('after the article', () => {
  test('links to the previous and next articles', async ({ page }) => {
    await page.goto(ARTICLE_PATH);
    const navigation = page.getByRole('navigation', { name: 'Artigos anterior e seguinte' });

    await navigation.getByRole('link', { name: /Anterior/ }).click();

    await expect(page).not.toHaveURL(ARTICLE_PATH);
    await expect(
      page.getByRole('navigation', { name: 'Artigos anterior e seguinte' }),
    ).toBeVisible();
  });

  test('suggests three other articles, without the companion reading', async ({ page }) => {
    await page.goto(ARTICLE_PATH);
    const related = page.getByRole('region', { name: 'Leia também' });

    await expect(related.getByRole('article')).toHaveCount(3);
    await expect(
      related.getByRole('link', { name: 'O que a gente deixa nos cômodos' }),
    ).toHaveCount(0);
  });
});

test.describe('search', () => {
  test('finds articles as the reader types and keeps the query in the address', async ({
    page,
  }) => {
    await page.goto('/busca');

    await page.getByRole('searchbox').fill('mare');

    await expect(page.getByRole('link', { name: 'A maré que não volta' })).toBeVisible();
    await expect(page.getByRole('status')).toContainText('para “mare”');
    await expect(page).toHaveURL('/busca?q=mare');
  });

  test('restores a search from the address', async ({ page }) => {
    await page.goto('/busca?q=gaveta');

    await expect(page.getByRole('searchbox')).toHaveValue('gaveta');
    await expect(
      page.getByRole('link', { name: 'A gaveta como arquitetura do romance' }),
    ).toBeVisible();
  });

  test('says so when nothing matches', async ({ page }) => {
    await page.goto('/busca');

    await page.getByRole('searchbox').fill('palavra inexistente');

    await expect(page.getByText('Nenhum resultado para “palavra inexistente”.')).toBeVisible();
  });

  test('opens from the search button in the header', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Buscar' }).click();

    await expect(page).toHaveURL('/busca');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Busca');
  });
});

test.describe('search engines and sharing', () => {
  test.beforeEach(({ page }) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) < DESKTOP_BREAKPOINT,
      'Metadata is the same at every width; checking once is enough.',
    );
  });

  test('an article declares its canonical URL, share card and structured data', async ({
    page,
    request,
  }) => {
    await page.goto(ARTICLE_PATH);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(new URL(canonical ?? '').pathname).toBe(ARTICLE_PATH);

    const shareImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    const imageResponse = await request.get(new URL(shareImage ?? '').pathname);
    expect(imageResponse.headers()['content-type']).toBe('image/png');

    const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
    expect(JSON.parse(structuredData ?? '{}')).toMatchObject({
      '@type': 'Article',
      headline: 'A maré que não volta',
    });
  });

  test('the sitemap never lists demonstration content', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text();

    expect(sitemap).toContain('<urlset');
    expect(sitemap).toContain('/sobre</loc>');
    expect(sitemap).not.toContain('a-mare-que-nao-volta');
    expect(sitemap).not.toContain('/duas-leituras');
  });

  test('robots.txt keeps crawlers out of builds that are not production', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text();

    expect(robots).toContain('Disallow: /');
  });
});
