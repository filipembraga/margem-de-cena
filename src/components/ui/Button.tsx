import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { classNames } from '@/lib/class-names';

/**
 * `primary`: solid foreground fill. `secondary`: foreground outline.
 * `accent`: accent outline (spoiler reveal). `inverse`: outline on dark bands.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'inverse';

const VARIANT_CLASS_NAMES: Record<ButtonVariant, string> = {
  primary: 'bg-fg text-bg hover:bg-accent',
  secondary: 'border border-fg text-fg hover:border-accent hover:text-accent',
  accent: 'border border-accent text-accent hover:bg-accent hover:text-accent-ink',
  inverse:
    'border border-inverse-fg text-inverse-fg hover:border-inverse-accent hover:text-inverse-accent',
};

function getButtonClassNames(variant: ButtonVariant, className?: string): string {
  return classNames(
    'inline-flex min-h-11 items-center justify-center gap-2.5 px-5 text-[0.8125rem] font-medium',
    VARIANT_CLASS_NAMES[variant],
    className,
  );
}

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  return (
    <button type={type} className={getButtonClassNames(variant, className)} {...buttonProps} />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

/** A link that looks like a button, for navigation actions ("Ver arquivo"). */
export function ButtonLink({ variant = 'primary', className, ...linkProps }: ButtonLinkProps) {
  return <Link className={getButtonClassNames(variant, className)} {...linkProps} />;
}
