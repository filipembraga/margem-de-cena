'use client';

import { ErrorView } from '@/components/layout/ErrorView';

import { fontVariableClassNames } from './fonts';
import './globals.css';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Replaces the root layout when the layout itself fails, so it brings its own document. */
export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="pt-BR" className={fontVariableClassNames}>
      <body className="flex min-h-dvh flex-col bg-bg text-fg">
        <ErrorView onRetry={reset} />
      </body>
    </html>
  );
}
