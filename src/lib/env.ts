import { z } from 'zod';

/**
 * Environment variables, validated once at startup. Server-side only: client components
 * must not import this module.
 */

const environmentVariablesSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
  SHOW_DEMO_CONTENT: z.enum(['true', 'false']).default('false'),
  VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
});

export type Environment = {
  /** Public base URL, used for canonical URLs, Open Graph and the sitemap. */
  siteUrl: URL;
  /** Whether demonstration content and the styleguide are visible. */
  showDemoContent: boolean;
  /** True only for the Vercel production deployment. */
  isVercelProduction: boolean;
};

type EnvironmentVariables = Record<string, string | undefined>;

/** Validates raw environment variables. Throws with a readable message when they are invalid. */
export function readEnvironment(variables: EnvironmentVariables): Environment {
  const result = environmentVariablesSchema.safeParse(withoutEmptyValues(variables));

  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }

  const showDemoContent = result.data.SHOW_DEMO_CONTENT === 'true';
  const isVercelProduction = result.data.VERCEL_ENV === 'production';

  // Demo content must never reach production (docs/adr/0004-demo-content-isolation.md).
  if (showDemoContent && isVercelProduction) {
    throw new Error(
      'SHOW_DEMO_CONTENT=true is not allowed when VERCEL_ENV=production. ' +
        'See docs/adr/0004-demo-content-isolation.md.',
    );
  }

  return {
    siteUrl: new URL(result.data.NEXT_PUBLIC_SITE_URL),
    showDemoContent,
    isVercelProduction,
  };
}

/** An empty variable (`SHOW_DEMO_CONTENT=`) means "not set", so the default applies. */
function withoutEmptyValues(variables: EnvironmentVariables): EnvironmentVariables {
  return Object.fromEntries(Object.entries(variables).filter(([, value]) => value !== ''));
}

export const environment: Environment = readEnvironment(process.env);
