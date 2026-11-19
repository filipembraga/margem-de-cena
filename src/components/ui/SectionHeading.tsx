import Link from 'next/link';

import { classNames } from '@/lib/class-names';

type SectionHeadingProps = {
  title: string;
  /** Lets the section use `aria-labelledby`. */
  id?: string;
  /**
   * `label`: small uppercase label under a double rule ("Recentes", "Ensaios").
   * `display`: large serif title over a hairline ("Filmes", "Livros").
   */
  variant?: 'label' | 'display';
  link?: { label: string; href: string };
  /** Short text on the right when there is no link ("textos longos e temáticos"). */
  aside?: string;
  headingLevel?: 'h2' | 'h3';
  className?: string;
};

export function SectionHeading({
  title,
  id,
  variant = 'label',
  link,
  aside,
  headingLevel: Heading = 'h2',
  className,
}: SectionHeadingProps) {
  const isLabel = variant === 'label';

  return (
    <div
      className={classNames(
        'flex items-baseline justify-between gap-4',
        isLabel ? 'pt-3 rule-double-top' : 'border-b border-fg pb-2.5',
        className,
      )}
    >
      <Heading
        id={id}
        className={isLabel ? 'type-label' : 'font-display text-4xl leading-tight font-medium'}
      >
        {title}
      </Heading>
      {link && (
        <Link
          href={link.href}
          className={classNames(
            'text-muted underline decoration-1 underline-offset-4 hover:text-accent',
            isLabel ? 'type-nav-compact' : 'type-meta-small',
          )}
        >
          {link.label}
        </Link>
      )}
      {!link && aside && <p className="type-meta-small text-muted">{aside}</p>}
    </div>
  );
}
