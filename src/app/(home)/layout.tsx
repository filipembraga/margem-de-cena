import type { ReactNode } from 'react';

import { MainContent } from '@/components/layout/MainContent';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { TopStrip } from '@/components/layout/TopStrip';
import { environment } from '@/lib/env';

/** Home page chrome: top strip and the full header with tagline. */
export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopStrip showCoverageLine showDemoLabel={environment.showDemoContent} />
      <SiteHeader variant="full" />
      <MainContent>{children}</MainContent>
    </>
  );
}
