import Image from 'next/image';

import type { ImageAsset } from '@/content';
import { classNames } from '@/lib/class-names';

import { TypographicCover } from './TypographicCover';

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
 * - `image`: a licensed image from the content layer.
 * - `fallback`: typographic cover for articles without a licensed image.
 * - `placeholder`: beige box with a caption, used only by the styleguide page.
 */
export type CoverSource =
  | { kind: 'image'; image: ImageAsset }
  | { kind: 'fallback'; title: string; kicker?: string }
  | { kind: 'placeholder'; caption: string };

type CoverProps = {
  source: CoverSource;
  aspectRatio: CoverAspectRatio;
  /** `sizes` for the responsive image, e.g. "(min-width: 1024px) 400px, 100vw". */
  sizes?: string;
  /** Loads the image eagerly; use for the largest image above the fold. */
  isPriority?: boolean;
  /** Adds the 24px L-shaped frame marks, offset 8px outside the image. */
  withCropMarks?: boolean;
  className?: string;
};

export function Cover({
  source,
  aspectRatio,
  sizes = '100vw',
  isPriority = false,
  withCropMarks = false,
  className,
}: CoverProps) {
  return (
    <div className={classNames('relative', ASPECT_RATIO_CLASS_NAMES[aspectRatio], className)}>
      <CoverContent source={source} sizes={sizes} isPriority={isPriority} />
      {withCropMarks && <CropMarks />}
    </div>
  );
}

function CoverContent({
  source,
  sizes,
  isPriority,
}: {
  source: CoverSource;
  sizes: string;
  isPriority: boolean;
}) {
  switch (source.kind) {
    case 'image':
      return (
        <Image
          src={source.image.src}
          alt={source.image.alt}
          fill
          sizes={sizes}
          preload={isPriority}
          className="bg-line object-cover"
        />
      );
    case 'fallback':
      return <TypographicCover title={source.title} kicker={source.kicker} />;
    case 'placeholder':
      return <PlaceholderCover caption={source.caption} />;
  }
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
