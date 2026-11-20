import type { ReactNode } from 'react';

import { Kicker } from '@/components/ui/Kicker';

type PageHeaderProps = {
  title: string;
  kicker?: string;
  description?: ReactNode;
};

/** Opening of an inner page (archives, tag and author pages, institutional pages). */
export function PageHeader({ title, kicker, description }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-fg pt-14 pb-8 lg:pt-18">
      {kicker && <Kicker>{kicker}</Kicker>}
      <h1 className="type-article-title text-balance">{title}</h1>
      {description && (
        <div className="max-w-160 type-excerpt-large text-fg-soft">{description}</div>
      )}
    </header>
  );
}
