'use client';

import Link from 'next/link';

import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

import { MainContent } from './MainContent';
import { Wordmark } from './Wordmark';

type ErrorViewProps = {
  /** Renders the failed part of the page again. */
  onRetry: () => void;
};

/**
 * Shown when a page fails while rendering in the browser. The site is static, so this is
 * rare; the page offers to try again or to go back to the home page.
 */
export function ErrorView({ onRetry }: ErrorViewProps) {
  return (
    <>
      <div className="border-b border-fg">
        <div className="page-container py-4">
          <Link href="/" aria-label="Margem de Cena — página inicial" className="inline-flex">
            <Wordmark size="compact" />
          </Link>
        </div>
      </div>
      <MainContent>
        <div className="page-container py-20 sm:py-28">
          <p className="pb-4 type-kicker text-accent">Erro</p>
          <EmptyState
            headingLevel="h1"
            title="Algo saiu do lugar."
            description="Não foi possível mostrar esta página agora. Tente de novo; se o problema continuar, volte à página inicial."
            action={
              <div className="flex flex-wrap gap-3">
                <Button onClick={onRetry}>Tentar de novo</Button>
                <ButtonLink href="/" variant="secondary">
                  Ir para a página inicial
                </ButtonLink>
              </div>
            }
          />
        </div>
      </MainContent>
    </>
  );
}
