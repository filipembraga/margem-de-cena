'use client';

import { ErrorView } from '@/components/layout/ErrorView';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Catches errors in any page; the root layout (and its footer) stays in place. */
export default function ErrorPage({ reset }: ErrorPageProps) {
  return <ErrorView onRetry={reset} />;
}
