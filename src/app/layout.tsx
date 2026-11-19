import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/SiteFooter';
import { SkipLink } from '@/components/layout/SkipLink';
import { environment } from '@/lib/env';
import { siteConfig } from '@/lib/site-config';
import { getThemeInitializationScript } from '@/lib/theme';

import { fontVariableClassNames } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: environment.siteUrl,
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: siteConfig.name,
  },
  // Only the production deployment is indexed; previews and local builds are not (ADR 0004).
  robots: {
    index: environment.isVercelProduction,
    follow: environment.isVercelProduction,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f0e8' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1b19' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The inline theme script sets data-theme before hydration, hence the warning suppression
    // on this element only (docs/adr/0005-theme-switching-without-a-library.md).
    <html lang="pt-BR" className={fontVariableClassNames} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeInitializationScript() }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-bg text-fg">
        <SkipLink />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
