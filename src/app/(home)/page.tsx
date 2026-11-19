import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { environment } from '@/lib/env';
import { siteConfig } from '@/lib/site-config';

/**
 * Stage 2: there is no content layer yet, so the home page shows its intentional empty state.
 * The editorial blocks arrive with the content model in Stage 3.
 */
export default function HomePage() {
  return (
    <div className="page-container py-20 sm:py-28">
      <h1 className="sr-only">{siteConfig.name}</h1>
      <EmptyState
        headingLevel="h2"
        title="Por enquanto, nada publicado."
        description="Os primeiros textos da Margem de Cena chegam em breve."
        action={
          environment.showDemoContent ? (
            <ButtonLink href="/componentes" variant="secondary">
              Ver componentes
            </ButtonLink>
          ) : undefined
        }
      />
    </div>
  );
}
