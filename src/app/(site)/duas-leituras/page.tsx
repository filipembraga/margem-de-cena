import type { Metadata } from 'next';

import { PageHeader } from '@/components/layout/PageHeader';
import { TwoPerspectivesBlock } from '@/components/two-perspectives/TwoPerspectivesBlock';
import { EmptyState } from '@/components/ui/EmptyState';
import { getAllTwoPerspectives } from '@/content';
import { buildPageMetadata } from '@/lib/seo';

const DESCRIPTION =
  'Uma mesma obra, dois textos independentes. Cada autor escreve a sua leitura sem ler a do outro antes da publicação.';

export const metadata: Metadata = buildPageMetadata({
  title: 'Duas Leituras',
  description: DESCRIPTION,
  path: '/duas-leituras',
});

export default async function TwoPerspectivesArchivePage() {
  const entries = await getAllTwoPerspectives();

  return (
    <div className="page-container pb-22">
      <PageHeader title="Duas Leituras" description={DESCRIPTION} />
      {entries.length > 0 ? (
        <ul>
          {entries.map((entry) => (
            <li key={entry.slug} className="border-b border-line py-14 last:border-b-0">
              <TwoPerspectivesBlock
                entry={entry}
                headingLevel="h2"
                label={entry.isDemo ? 'Duas Leituras · Demonstração' : 'Duas Leituras'}
              />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          className="pt-12"
          title="Por enquanto, nenhuma obra tem as duas leituras publicadas."
          description="Uma obra entra aqui quando os dois textos sobre ela estiverem no ar."
        />
      )}
    </div>
  );
}
