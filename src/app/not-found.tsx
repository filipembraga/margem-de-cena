import type { Metadata } from 'next';

import { MainContent } from '@/components/layout/MainContent';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

// No `robots` here: Next adds `noindex` to every not-found response on its own.
export const metadata: Metadata = {
  title: 'Página não encontrada',
};

export default function NotFoundPage() {
  return (
    <>
      <SiteHeader variant="compact" />
      <MainContent>
        <div className="page-container py-20 sm:py-28">
          <p className="pb-4 type-kicker text-accent">Erro 404</p>
          <EmptyState
            headingLevel="h1"
            title="Esta página não existe, ou ainda não foi escrita."
            description="O endereço pode ter mudado. A página inicial reúne tudo o que já foi publicado."
            action={<ButtonLink href="/">Ir para a página inicial</ButtonLink>}
          />
        </div>
      </MainContent>
    </>
  );
}
