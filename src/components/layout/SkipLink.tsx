export const MAIN_CONTENT_ID = 'conteudo';

/** First focusable element on every page: jumps over the header to the main content. */
export function SkipLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only bg-fg px-4 py-3 type-meta text-bg focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
    >
      Pular para o conteúdo
    </a>
  );
}
