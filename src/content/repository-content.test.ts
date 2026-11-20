import { describe, expect, it } from 'vitest';

import { buildCatalog } from './catalog';
import { createFilesystemSource } from './sources/filesystem';

/**
 * Runs the real `content/` folder through the pipeline, so a broken content file fails the
 * unit tests as well as the build.
 */
describe('repository content', () => {
  it('is valid with and without demo content', async () => {
    const source = createFilesystemSource();

    await expect(buildCatalog(source, { includeDemo: false })).resolves.toBeDefined();
    await expect(buildCatalog(source, { includeDemo: true })).resolves.toBeDefined();
  });

  it('never exposes demo content when demo content is off', async () => {
    const catalog = await buildCatalog(createFilesystemSource(), { includeDemo: false });

    const demoEntries = [
      ...catalog.articles.filter((article) => article.isDemo),
      ...catalog.works.filter((work) => work.isDemo),
      ...catalog.twoPerspectives.filter((entry) => entry.isDemo),
    ];
    expect(demoEntries).toEqual([]);
  });
});
