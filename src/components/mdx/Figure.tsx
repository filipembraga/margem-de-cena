import Image from 'next/image';

import type { ImageSize } from '@/content';

export type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
  credit: string;
  license: string;
};

/**
 * An image in the body, at its natural proportion (a book cover stays 2:3), never wider than
 * the reading column nor taller than most of the screen. The caption ends with the credit
 * and licence, which every image needs.
 */
export function Figure({
  src,
  alt,
  caption,
  credit,
  license,
  size,
}: FigureProps & { size: ImageSize }) {
  return (
    <figure className="my-2 flex flex-col gap-2.5">
      <Image
        src={src}
        alt={alt}
        width={size.width}
        height={size.height}
        sizes="(min-width: 1024px) 680px, 100vw"
        className="h-auto max-h-[75vh] w-auto max-w-full self-start object-contain"
      />
      <figcaption className="type-caption text-muted">
        {caption && <span className="text-fg-soft">{caption} </span>}
        {credit} · {license}
      </figcaption>
    </figure>
  );
}
