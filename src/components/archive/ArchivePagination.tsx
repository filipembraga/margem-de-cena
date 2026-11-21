import Link from 'next/link';

import { getArchivePath, type ArchiveSelection } from '@/lib/archive-paths';
import { classNames } from '@/lib/class-names';

type ArchivePaginationProps = {
  selection: ArchiveSelection;
  pageCount: number;
};

/**
 * "← Anterior · 1 2 3 · Próxima →" under an archive. Every page is a static URL, so the
 * links work without JavaScript. Hidden when the archive fits on one page.
 */
export function ArchivePagination({ selection, pageCount }: ArchivePaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  const { pageNumber } = selection;
  const pathOfPage = (targetPage: number) =>
    getArchivePath({ ...selection, pageNumber: targetPage });
  const pageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Páginas do arquivo"
      className="mt-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-fg pt-4 type-meta"
    >
      <span className="min-w-24">
        {pageNumber > 1 && (
          <Link href={pathOfPage(pageNumber - 1)} rel="prev" className="link-body">
            ← Anterior
          </Link>
        )}
      </span>

      <ol className="flex flex-wrap items-center gap-1">
        {pageNumbers.map((targetPage) => {
          const isCurrent = targetPage === pageNumber;
          return (
            <li key={targetPage}>
              <Link
                href={pathOfPage(targetPage)}
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={`Página ${targetPage}`}
                className={classNames(
                  'inline-flex min-h-11 min-w-11 items-center justify-center border',
                  isCurrent
                    ? 'border-fg text-fg'
                    : 'border-transparent text-muted hover:text-accent',
                )}
              >
                {targetPage}
              </Link>
            </li>
          );
        })}
      </ol>

      <span className="min-w-24 text-right">
        {pageNumber < pageCount && (
          <Link href={pathOfPage(pageNumber + 1)} rel="next" className="link-body">
            Próxima →
          </Link>
        )}
      </span>
    </nav>
  );
}
