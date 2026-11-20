'use client';

import { useId, useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/Button';

type SpoilerProps = {
  /** What the passage reveals, e.g. "O próximo trecho comenta o plano final do filme." */
  description?: string;
  children: ReactNode;
};

const DEFAULT_DESCRIPTION = 'O próximo trecho revela pontos importantes da trama.';

/**
 * A passage the reader reveals on purpose. Until then the passage is `hidden`: not shown and
 * not read by screen readers, with skeleton lines standing in for it. Only the passage is
 * hidden, never the whole article (docs/design-system.md, Spoiler).
 */
export function Spoiler({ description = DEFAULT_DESCRIPTION, children }: SpoilerProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const labelId = useId();
  const passageId = useId();

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className="flex flex-col gap-4 border-y border-accent py-4.5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p id={labelId} className="type-kicker text-accent">
            Atenção: spoiler
          </p>
          <p className="font-ui text-sm text-fg-soft">{description}</p>
        </div>
        <Button
          variant="accent"
          aria-expanded={isRevealed}
          aria-controls={passageId}
          onClick={() => setIsRevealed((wasRevealed) => !wasRevealed)}
          className="w-full font-ui sm:w-auto"
        >
          {isRevealed ? 'Ocultar trecho' : 'Revelar trecho'}
        </Button>
      </div>

      <div id={passageId} hidden={!isRevealed} className="flex flex-col gap-7">
        {children}
      </div>
      {!isRevealed && <SkeletonLines />}
    </div>
  );
}

/** Placeholder bars that suggest hidden text without revealing its length. */
function SkeletonLines() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-2.5">
      <div className="h-3 w-full bg-line" />
      <div className="h-3 w-[86%] bg-line" />
      <div className="h-3 w-[64%] bg-line" />
    </div>
  );
}
