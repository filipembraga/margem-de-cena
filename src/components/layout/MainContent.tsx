import type { ReactNode } from 'react';

import { MAIN_CONTENT_ID } from './SkipLink';

/** The `<main>` landmark, target of the skip link. */
export function MainContent({ children }: { children: ReactNode }) {
  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 focus:outline-none">
      {children}
    </main>
  );
}
