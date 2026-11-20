'use client';

import { Share2 } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { classNames } from '@/lib/class-names';

type ShareBarProps = {
  /** Absolute URL of the article. */
  url: string;
  title: string;
};

type CopyStatus = 'idle' | 'copied' | 'failed';

const FEEDBACK_DURATION_IN_MILLISECONDS = 3000;

/** Browser support never changes while the page is open, so there is nothing to subscribe to. */
function subscribeToNothing(): () => void {
  return () => {};
}

function readShareSheetSupport(): boolean {
  return typeof navigator.share === 'function';
}

/** The server cannot know what the browser supports; the first render assumes no support. */
function readShareSheetSupportOnServer(): boolean {
  return false;
}

const ITEM_CLASS_NAMES =
  'inline-flex min-h-11 flex-auto items-center justify-center border border-fg px-3 ' +
  'whitespace-nowrap hover:text-accent sm:flex-none sm:border-0 sm:px-2';

/**
 * "Compartilhar": copy link, WhatsApp, Threads and e-mail. Where the browser offers the
 * system share sheet (mostly phones), a button opens it and replaces Threads and e-mail on
 * small screens. The copy result is announced through a live region.
 */
export function ShareBar({ url, title }: ShareBarProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const canUseShareSheet = useSyncExternalStore(
    subscribeToNothing,
    readShareSheetSupport,
    readShareSheetSupportOnServer,
  );
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopyStatus('idle'), FEEDBACK_DURATION_IN_MILLISECONDS);
  }

  async function openShareSheet() {
    try {
      await navigator.share({ title, url });
    } catch {
      // Closing the share sheet without choosing is not an error worth showing.
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedMessage = encodeURIComponent(`${title} ${url}`);
  const secondaryItemClassNames = classNames(
    ITEM_CLASS_NAMES,
    canUseShareSheet && 'hidden sm:inline-flex',
  );

  return (
    <section
      aria-label="Compartilhar"
      className="flex flex-wrap items-center gap-2 font-ui text-[0.8125rem] sm:gap-x-2 sm:gap-y-1 sm:border-y sm:border-fg sm:py-1.5"
    >
      <span aria-hidden="true" className="mr-2 hidden text-muted sm:inline">
        Compartilhar
      </span>
      <button type="button" onClick={copyLink} className={ITEM_CLASS_NAMES}>
        {copyStatus === 'copied' ? 'Link copiado' : 'Copiar link'}
      </button>
      <a
        href={`https://wa.me/?text=${encodedMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className={ITEM_CLASS_NAMES}
      >
        WhatsApp<span className="sr-only"> (abre em nova aba)</span>
      </a>
      <a
        href={`https://www.threads.com/intent/post?text=${encodedMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className={secondaryItemClassNames}
      >
        Threads<span className="sr-only"> (abre em nova aba)</span>
      </a>
      <a
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodedUrl}`}
        className={secondaryItemClassNames}
      >
        E-mail
      </a>
      {canUseShareSheet && (
        <button
          type="button"
          onClick={openShareSheet}
          aria-label="Mais opções de compartilhamento"
          className="inline-flex min-h-11 w-11 items-center justify-center border border-fg hover:text-accent sm:hidden"
        >
          <Share2 aria-hidden="true" size={18} strokeWidth={1.6} />
        </button>
      )}
      <p role="status" className="sr-only">
        {copyStatus === 'copied' && 'Link copiado.'}
        {copyStatus === 'failed' && 'Não foi possível copiar o link.'}
      </p>
    </section>
  );
}
