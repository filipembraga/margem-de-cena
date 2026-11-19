import type { ReactNode } from 'react';

import { MainContent } from '@/components/layout/MainContent';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { TopStrip } from '@/components/layout/TopStrip';
import { environment } from '@/lib/env';

/** Inner pages: compact header; the top strip appears only to label demo content. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopStrip showCoverageLine={false} showDemoLabel={environment.showDemoContent} />
      <SiteHeader variant="compact" />
      <MainContent>{children}</MainContent>
    </>
  );
}
