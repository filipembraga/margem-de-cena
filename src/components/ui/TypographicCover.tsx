type TypographicCoverProps = {
  /** The work's title (or the article's, for essays), in display italic. */
  title: string;
  /** Optional line above, such as the category. */
  kicker?: string;
};

/**
 * The cover of an article without a licensed image (docs/design-system.md, section 5).
 *
 * A dark surface in both themes: in the dark theme it does not invert into a light block,
 * which would glare and read as a missing image; it sits one step above `--band`, outlined
 * by a hairline. Uses only the `--cover-*` tokens. Fills its parent, which sets the ratio.
 * The padding and the title size follow the cover width (container query units), so the
 * same component works in a narrow book cover, a card or a hero, and the title never leaves
 * the cover. The text repeats the title next to it, so it is hidden from assistive
 * technology.
 */
export function TypographicCover({ title, kicker }: TypographicCoverProps) {
  return (
    <div
      aria-hidden="true"
      className="@container absolute inset-0 overflow-hidden border border-cover-border bg-cover-bg"
    >
      <div className="flex h-full flex-col justify-between p-[clamp(0.75rem,7cqi,1.25rem)]">
        {kicker ? (
          <p className="text-[0.625rem] tracking-[0.16em] text-cover-kicker uppercase">{kicker}</p>
        ) : (
          <span />
        )}
        <p className="font-display text-[clamp(1rem,0.75rem+5cqi,3.5rem)] leading-none text-cover-fg italic">
          {title}
        </p>
      </div>
    </div>
  );
}
