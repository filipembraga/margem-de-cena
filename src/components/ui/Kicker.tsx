import type { ReactNode } from 'react';

import { classNames } from '@/lib/class-names';

type KickerProps = {
  children: ReactNode;
  /** `inverse` for dark bands, where the accent switches to its light variant. */
  tone?: 'default' | 'inverse';
  className?: string;
};

/** Category label above a title: small uppercase text in the accent color. */
export function Kicker({ children, tone = 'default', className }: KickerProps) {
  return (
    <p
      className={classNames(
        'type-kicker',
        tone === 'inverse' ? 'text-inverse-accent' : 'text-accent',
        className,
      )}
    >
      {children}
    </p>
  );
}
