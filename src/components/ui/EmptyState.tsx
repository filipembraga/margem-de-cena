import type { ReactNode } from 'react';

import { classNames } from '@/lib/class-names';

type EmptyStateProps = {
  /** One literate sentence, e.g. "Por enquanto, nada publicado nesta seção." */
  title: string;
  description?: string;
  headingLevel?: 'h1' | 'h2' | 'p';
  /** Optional action below the text, such as a link back to the home page. */
  action?: ReactNode;
  className?: string;
};

/** Intentional, typographic empty state: no illustrations. */
export function EmptyState({
  title,
  description,
  headingLevel: Title = 'p',
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={classNames('flex max-w-xl flex-col gap-3', className)}>
      <Title className="font-display text-[2rem] leading-tight text-fg italic">{title}</Title>
      {description && <p className="type-meta text-muted">{description}</p>}
      {action && <div className="pt-3">{action}</div>}
    </div>
  );
}
