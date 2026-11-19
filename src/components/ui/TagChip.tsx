import Link from 'next/link';

import { classNames } from '@/lib/class-names';
import { getTagPath } from '@/lib/slug';

type TagChipProps = {
  name: string;
  /** `highlight` marks an editorial label such as "Duas Leituras". */
  tone?: 'default' | 'highlight';
  /** Renders a plain label instead of a link to the tag page. */
  asLabel?: boolean;
};

const TONE_CLASS_NAMES = {
  default: 'border border-line text-fg',
  highlight: 'border border-accent bg-accent text-accent-ink',
} as const;

/**
 * Square chip linking to `/tags/[slug]`. The chip stays visually small, and an invisible
 * extension of the link keeps the touch target at 44px tall.
 */
export function TagChip({ name, tone = 'default', asLabel = false }: TagChipProps) {
  const chipClassNames = classNames(
    'relative inline-block px-2.5 py-1.5 type-meta-small leading-none',
    TONE_CLASS_NAMES[tone],
  );

  if (asLabel) {
    return <span className={chipClassNames}>{name}</span>;
  }

  return (
    <Link
      href={getTagPath(name)}
      className={classNames(
        chipClassNames,
        'after:absolute after:inset-x-0 after:-inset-y-2 hover:border-accent hover:text-accent',
      )}
    >
      {name}
    </Link>
  );
}
