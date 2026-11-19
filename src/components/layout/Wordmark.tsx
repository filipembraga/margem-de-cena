import { classNames } from '@/lib/class-names';

type WordmarkLayout = 'horizontal' | 'stacked' | 'monogram';

/**
 * Sizes from the approved mockups. `header` shrinks to the mobile size below 1024px.
 * Each size pairs the font size with the gap to the margin rule.
 */
type WordmarkSize = 'header' | 'compact' | 'footer' | 'display';

type WordmarkTone = 'default' | 'inverse';

type WordmarkProps = {
  layout?: WordmarkLayout;
  size?: WordmarkSize;
  tone?: WordmarkTone;
  /** Shows the 2px margin rule on the left. */
  withMarginRule?: boolean;
  className?: string;
};

const SIZE_CLASS_NAMES: Record<WordmarkSize, { text: string; gap: string }> = {
  header: {
    text: 'text-[1.5rem] leading-none lg:text-[2.75rem] lg:leading-[0.9]',
    gap: 'gap-2 lg:gap-3.5',
  },
  compact: { text: 'text-[1.5rem] leading-none lg:text-[1.75rem]', gap: 'gap-2 lg:gap-2.5' },
  footer: { text: 'text-[2rem] leading-[0.9]', gap: 'gap-3' },
  display: { text: 'text-[4rem] leading-[0.86] sm:text-[6.5rem]', gap: 'gap-4 sm:gap-5.5' },
};

/**
 * The text-based logo: "Margem de Cena", with "de" in accent italic, like an annotation in the
 * margin. Decorative parts are hidden from assistive technology; the readable text stays.
 */
export function Wordmark({
  layout = 'horizontal',
  size = 'compact',
  tone = 'default',
  withMarginRule = true,
  className,
}: WordmarkProps) {
  const sizeClassNames = SIZE_CLASS_NAMES[size];
  const textColor = tone === 'inverse' ? 'text-inverse-fg' : 'text-fg';
  const accentColor = tone === 'inverse' ? 'text-inverse-accent' : 'text-accent';
  const ruleColor = tone === 'inverse' ? 'bg-inverse-accent' : 'bg-accent';

  return (
    <span className={classNames('inline-flex items-stretch', sizeClassNames.gap, className)}>
      {withMarginRule && (
        <span aria-hidden="true" className={classNames('w-0.5 shrink-0', ruleColor)} />
      )}
      <span
        className={classNames(
          'font-display font-medium tracking-[-0.01em] whitespace-nowrap',
          sizeClassNames.text,
          textColor,
        )}
      >
        {layout === 'monogram' ? (
          <span role="img" aria-label="Margem de Cena">
            M<span className={classNames('font-normal italic', accentColor)}>c</span>
          </span>
        ) : (
          <>
            Margem
            {layout === 'stacked' ? <br /> : ' '}
            <span className={classNames('font-normal italic', accentColor)}>de</span> Cena
          </>
        )}
      </span>
    </span>
  );
}
