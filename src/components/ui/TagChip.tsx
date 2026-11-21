import Link from 'next/link';

import { classNames } from '@/lib/class-names';
import { getTagPath } from '@/lib/slug';

type TagChipProps = {
  name: string;
  /** `highlight` marks an editorial label such as "Duas Leituras". */
  tone?: 'default' | 'highlight';
  /** Renders a plain label instead of a link to the tag page. */
  asLabel?: boolean;
  /** Links somewhere other than the tag page, e.g. an archive filtered by the tag. */
  href?: string;
  /** Marks the chip of the current page, e.g. the selected archive filter. */
  isCurrent?: boolean;
};

const CURRENT_CLASS_NAMES = 'border border-fg bg-fg text-bg';

const TONE_CLASS_NAMES = {
  default: 'border border-line text-fg',
  highlight: 'border border-accent bg-accent text-accent-ink',
} as const;

/**
 * Square chip linking to `/tags/[slug]` (or to `href`). The chip stays visually small, and an invisible
 * extension of the link keeps the touch target at 44px tall.
 */
export function TagChip({
  name,
  tone = 'default',
  asLabel = false,
  href,
  isCurrent = false,
}: TagChipProps) {
  const chipClassNames = classNames(
    'relative inline-block px-2.5 py-1.5 type-meta-small leading-none',
    isCurrent ? CURRENT_CLASS_NAMES : TONE_CLASS_NAMES[tone],
  );

  if (asLabel) {
    return <span className={chipClassNames}>{name}</span>;
  }

  return (
    <Link
      href={href ?? getTagPath(name)}
      aria-current={isCurrent ? 'page' : undefined}
      className={classNames(
        chipClassNames,
        'after:absolute after:inset-x-0 after:-inset-y-2',
        !isCurrent && 'hover:border-accent hover:text-accent',
      )}
    >
      {name}
    </Link>
  );
}
