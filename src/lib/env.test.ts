import { describe, expect, it } from 'vitest';

import { readEnvironment } from './env';

describe('readEnvironment', () => {
  it('hides demo content when SHOW_DEMO_CONTENT is not set', () => {
    const environment = readEnvironment({});

    expect(environment.showDemoContent).toBe(false);
  });

  it('treats an empty variable as not set', () => {
    const environment = readEnvironment({ SHOW_DEMO_CONTENT: '' });

    expect(environment.showDemoContent).toBe(false);
  });

  it('shows demo content in preview deployments when enabled', () => {
    const environment = readEnvironment({ SHOW_DEMO_CONTENT: 'true', VERCEL_ENV: 'preview' });

    expect(environment.showDemoContent).toBe(true);
    expect(environment.isVercelProduction).toBe(false);
  });

  it('refuses demo content in production', () => {
    expect(() => readEnvironment({ SHOW_DEMO_CONTENT: 'true', VERCEL_ENV: 'production' })).toThrow(
      /not allowed/,
    );
  });

  it('parses the public site URL', () => {
    const environment = readEnvironment({ NEXT_PUBLIC_SITE_URL: 'https://example.com' });

    expect(environment.siteUrl.origin).toBe('https://example.com');
  });

  it('rejects an invalid site URL', () => {
    expect(() => readEnvironment({ NEXT_PUBLIC_SITE_URL: 'not a url' })).toThrow(
      /Invalid environment variables/,
    );
  });

  it('rejects a value other than "true" or "false" for the demo flag', () => {
    expect(() => readEnvironment({ SHOW_DEMO_CONTENT: 'yes' })).toThrow(
      /Invalid environment variables/,
    );
  });
});
