'use client';

import { Share2 } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react';

import { classNames } from '@/lib/class-names';

type ShareBarProps = {
  /** Absolute URL of the article. */
  url: string;
  title: string;
  /** Path of the article's Instagram Stories image, e.g. `/filmes/a-mare/stories.png`. */
  storiesImagePath: string;
};

type CopyStatus = 'idle' | 'copied' | 'failed';
type StoriesStatus = 'idle' | 'failed';

const FEEDBACK_DURATION_IN_MILLISECONDS = 3000;

/** Browser support never changes while the page is open, so there is nothing to subscribe to. */
function subscribeToNothing(): () => void {
  return () => {};
}

function readShareSheetSupport(): boolean {
  return typeof navigator.share === 'function';
}

/** The server cannot know what the browser supports; the first render assumes no support. */
function readSupportOnServer(): boolean {
  return false;
}

/**
 * Whether the system share sheet accepts an image file. Only then can the "Instagram" button
 * hand the Stories image to the Instagram app (docs/adr/0012). Desktop browsers usually
 * cannot, and the button does not appear.
 */
function readFileSharingSupport(): boolean {
  if (typeof navigator.canShare !== 'function') {
    return false;
  }
  const sampleImage = new File([''], 'imagem.png', { type: 'image/png' });
  return navigator.canShare({ files: [sampleImage] });
}

/** Downloads the Stories image as a file the share sheet can carry. */
async function fetchStoriesImage(imagePath: string): Promise<File> {
  const response = await fetch(imagePath);
  if (!response.ok) {
    throw new Error(`Stories image request failed with status ${response.status}.`);
  }
  const fileName = imagePath.split('/').slice(-2).join('-');
  return new File([await response.blob()], fileName, { type: 'image/png' });
}

/**
 * Starts downloading the Stories image once and keeps the download in `cache` for the tap.
 * A failed download is forgotten, so the next tap tries again.
 */
function downloadStoriesImageOnce(
  cache: RefObject<Promise<File> | null>,
  imagePath: string,
): Promise<File> {
  if (cache.current === null) {
    const download = fetchStoriesImage(imagePath);
    cache.current = download;
    download.catch(() => {
      if (cache.current === download) {
        cache.current = null;
      }
    });
  }
  return cache.current;
}

function isCancelledByReader(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

const ITEM_CLASS_NAMES =
  'inline-flex min-h-11 flex-auto items-center justify-center border border-fg px-3 ' +
  'whitespace-nowrap hover:text-accent sm:flex-none sm:border-0 sm:px-2';

/**
 * "Compartilhar": copy link, WhatsApp, Threads and e-mail. Where the browser offers the
 * system share sheet (mostly phones), a button opens it and replaces Threads and e-mail on
 * small screens. Where the share sheet also accepts files, an "Instagram" button shares the
 * Stories image together with the link. Results are announced through a live region.
 */
export function ShareBar({ url, title, storiesImagePath }: ShareBarProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const [storiesStatus, setStoriesStatus] = useState<StoriesStatus>('idle');
  const canUseShareSheet = useSyncExternalStore(
    subscribeToNothing,
    readShareSheetSupport,
    readSupportOnServer,
  );
  const canShareFiles = useSyncExternalStore(
    subscribeToNothing,
    readFileSharingSupport,
    readSupportOnServer,
  );
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const storiesImage = useRef<Promise<File> | null>(null);
  const shareBarElement = useRef<HTMLElement>(null);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  // Browsers only open the share sheet shortly after a tap, so the image is downloaded ahead,
  // once the share bar comes near the screen, instead of after the tap.
  useEffect(() => {
    const element = shareBarElement.current;
    if (!canShareFiles || !element) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void downloadStoriesImageOnce(storiesImage, storiesImagePath);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [canShareFiles, storiesImagePath]);

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

  async function shareToInstagram() {
    setStoriesStatus('idle');
    try {
      const image = await downloadStoriesImageOnce(storiesImage, storiesImagePath);
      const imageWithLink = { files: [image], title, url };
      await navigator.share(navigator.canShare(imageWithLink) ? imageWithLink : { files: [image] });
    } catch (error) {
      if (!isCancelledByReader(error)) {
        setStoriesStatus('failed');
      }
    }
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
      ref={shareBarElement}
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
      {canShareFiles && (
        <button type="button" onClick={shareToInstagram} className={ITEM_CLASS_NAMES}>
          Instagram<span className="sr-only"> (imagem para os Stories)</span>
        </button>
      )}
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
        {storiesStatus === 'failed' && 'Não foi possível preparar a imagem para o Instagram.'}
      </p>
    </section>
  );
}
