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

  test('hides the Instagram button when the browser cannot share files', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'canShare', { value: () => false, configurable: true });
    });
    await page.goto(ARTICLE_PATH);

    await expect(
      page.getByRole('region', { name: 'Compartilhar' }).getByRole('button', { name: /Instagram/ }),
    ).toHaveCount(0);
  });

  test('shares the Stories image and the link where the browser accepts files', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const sharedData: Array<{ files: Array<{ name: string; type: string; size: number }> }> = [];
      Object.assign(window, { sharedData });
      Object.defineProperty(navigator, 'canShare', { value: () => true, configurable: true });
      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value: async (data: ShareData) => {
          sharedData.push({
            ...data,
            files: (data.files ?? []).map(({ name, type, size }) => ({ name, type, size })),
          });
        },
      });
    });
    await page.goto(ARTICLE_PATH);

    await page
      .getByRole('region', { name: 'Compartilhar' })
      .getByRole('button', { name: /Instagram/ })
      .click();

    await expect
      .poll(() => page.evaluate(() => (window as unknown as { sharedData: unknown[] }).sharedData))
      .toEqual([
        expect.objectContaining({
          title: 'A maré que não volta',
          url: expect.stringContaining(ARTICLE_PATH),
          files: [
            {
              name: 'a-mare-que-nao-volta-stories.png',
              type: 'image/png',
              size: expect.any(Number),
            },
          ],
        }),
      ]);
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

    const structuredData = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).map((json) => JSON.parse(json) as Record<string, unknown>);
    expect(structuredData).toEqual([
      expect.objectContaining({ '@type': 'Article', headline: 'A maré que não volta' }),
      expect.objectContaining({
        '@type': 'BreadcrumbList',
        itemListElement: [
          expect.objectContaining({ position: 1, name: 'Início' }),
          expect.objectContaining({ position: 2, name: 'Filmes' }),
          expect.objectContaining({ position: 3, name: 'A maré que não volta' }),
        ],
      }),
    ]);
  });

  test('every page has exactly one robots tag', async ({ page }) => {
    for (const path of ['/', ARTICLE_PATH, '/busca', '/filmes/etiqueta/memoria']) {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]'), path).toHaveCount(1);
    }
  });

  test('an article has its card in the proportion of an Instagram post', async ({ request }) => {
    const response = await request.get(`${ARTICLE_PATH}/instagram.png`);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('image/png');
    // A PNG stores its width and height at bytes 16 to 23.
    const image = await response.body();
    expect([image.readUInt32BE(16), image.readUInt32BE(20)]).toEqual([1080, 1350]);
  });

  test('an article and a Duas Leituras entry have a Stories image', async ({ request }) => {
    for (const path of [ARTICLE_PATH, '/duas-leituras/a-casa-das-mares']) {
      const response = await request.get(`${path}/stories.png`);

      expect(response.headers()['content-type'], path).toBe('image/png');
      const image = await response.body();
      expect([image.readUInt32BE(16), image.readUInt32BE(20)], path).toEqual([1080, 1920]);
    }
  });

  test('an archive filtered by a tag stays out of search engines', async ({ page }) => {
    await page.goto('/filmes/etiqueta/memoria');

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
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

test.describe('category archive', () => {
  test('filters the archive by a tag and back', async ({ page }) => {
    await page.goto('/filmes');
    const filter = page.getByRole('navigation', { name: 'Filtrar por etiqueta' });
    await expect(filter.getByRole('link', { name: 'Todas' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await filter.getByRole('link', { name: 'horror' }).click();

    await expect(page).toHaveURL('/filmes/etiqueta/horror');
    await expect(filter.getByRole('link', { name: 'horror' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page.getByRole('heading', { level: 2 })).toHaveText([
      'O medo que mora no corredor',
    ]);

    await filter.getByRole('link', { name: 'Todas' }).click();
    await expect(page).toHaveURL('/filmes');
  });

  test('shows no page links while the archive fits on one page', async ({ page }) => {
    await page.goto('/filmes');

    await expect(page.getByRole('navigation', { name: 'Páginas do arquivo' })).toHaveCount(0);
  });
});

test.describe('Instagram invitation', () => {
  test("invites readers to the authors' profiles while the publication has none", async ({
    page,
  }) => {
    await page.goto('/');
    const invitation = page.getByRole('region', { name: 'No Instagram' });

    await expect(invitation.getByRole('link')).toHaveText([
      /^Seguir @drika0/,
      /^Seguir @djfillzouk/,
    ]);
    await expect(
      invitation.getByRole('link', {
        name: /djfillzouk \(perfil de Filipe Braga; abre em nova aba\)/,
      }),
    ).toHaveAttribute('href', 'https://www.instagram.com/djfillzouk/');
  });
});
