import { classNames } from '@/lib/class-names';

/** Image ratios from the design system (section 5). */
export type CoverAspectRatio = '16:10' | '21:9' | '4:3' | '3:2' | '16:9' | '2:3' | '3:4';

const ASPECT_RATIO_CLASS_NAMES: Record<CoverAspectRatio, string> = {
  '16:10': 'aspect-[16/10]',
  '21:9': 'aspect-[21/9]',
  '4:3': 'aspect-[4/3]',
  '3:2': 'aspect-[3/2]',
  '16:9': 'aspect-[16/9]',
  '2:3': 'aspect-[2/3]',
  '3:4': 'aspect-[3/4]',
};

/**
 * What fills a cover slot.
 * - `placeholder`: beige box with a caption, for demonstration content only.
 * - `fallback`: typographic cover for articles without a licensed image.
 * Licensed images (`next/image`) join this union with the content layer in Stage 3.
 */
export type CoverSource =
  { kind: 'placeholder'; caption: string } | { kind: 'fallback'; title: string; kicker?: string };

type CoverProps = {
  source: CoverSource;
  aspectRatio: CoverAspectRatio;
  /** Adds the 24px L-shaped frame marks, offset 8px outside the image. */
  withCropMarks?: boolean;
  className?: string;
};

export function Cover({ source, aspectRatio, withCropMarks = false, className }: CoverProps) {
  return (
    <div className={classNames('relative', ASPECT_RATIO_CLASS_NAMES[aspectRatio], className)}>
      {source.kind === 'placeholder' ? (
        <PlaceholderCover caption={source.caption} />
      ) : (
        <FallbackCover title={source.title} kicker={source.kicker} />
      )}
      {withCropMarks && <CropMarks />}
    </div>
  );
}

function PlaceholderCover({ caption }: { caption: string }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-line">
      <p className="absolute bottom-3.5 left-4 text-[0.625rem] tracking-[0.14em] text-fg uppercase">
        {caption}
      </p>
    </div>
  );
}

/**
 * Inverse fill with the title in display italic. The title size follows the cover width
 * (container query units), so the same component works in a card or a hero.
 */
function FallbackCover({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div className="@container absolute inset-0 flex flex-col justify-between bg-inverse-bg p-5">
      {kicker ? (
        <p className="text-[0.625rem] tracking-[0.16em] text-inverse-accent uppercase">{kicker}</p>
      ) : (
        <span />
      )}
      <p
        aria-hidden="true"
        className="font-display text-[clamp(1.5rem,9cqi,3.5rem)] leading-none text-inverse-fg italic"
      >
        {title}
      </p>
    </div>
  );
}

function CropMarks() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 -left-2 size-6 border-t border-l border-fg"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -bottom-2 size-6 border-r border-b border-fg"
      />
    </>
  );
}
