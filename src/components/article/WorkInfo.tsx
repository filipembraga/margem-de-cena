import type { Work } from '@/content';

import { getWorkFacts } from './work-facts';

type WorkInfoProps = {
  work: Work;
  hasSpoilerWarning: boolean;
};

const HEADING = 'A obra';

/**
 * "Ficha da obra": an aside beside the text on wide screens, and a collapsible
 * block above the text on small ones. Only one of the two is displayed at a time.
 */
export function WorkInfo({ work, hasSpoilerWarning }: WorkInfoProps) {
  return (
    <>
      <aside
        aria-label="Ficha da obra"
        className="hidden flex-col gap-3.5 self-start border-t border-fg pt-3.5 lg:flex"
      >
        <p className="font-display text-xl text-accent italic">{HEADING}</p>
        <WorkFactList work={work} hasSpoilerWarning={hasSpoilerWarning} />
      </aside>
      <details className="border-y border-fg lg:hidden">
        <summary className="flex min-h-11 cursor-pointer items-center font-display text-xl text-accent italic">
          {HEADING}
        </summary>
        <div className="pb-4">
          <WorkFactList work={work} hasSpoilerWarning={hasSpoilerWarning} />
        </div>
      </details>
    </>
  );
}

function WorkFactList({ work, hasSpoilerWarning }: WorkInfoProps) {
  const facts = getWorkFacts(work);
  if (hasSpoilerWarning) {
    facts.push({ label: 'Spoilers', value: 'Sim, sinalizados no texto' });
  }

  return (
    <dl className="flex flex-col gap-3.5 font-ui text-[0.8125rem] leading-normal">
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt className="text-[0.6875rem] tracking-[0.12em] text-muted uppercase">{fact.label}</dt>
          <dd className="mt-0.5">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
