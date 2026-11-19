import { siteConfig } from '@/lib/site-config';

type TopStripProps = {
  /** "Cinema · Literatura · Televisão", shown on the home page. */
  showCoverageLine: boolean;
  /** Labels the whole site as a demonstration while demo content is visible (ADR 0004). */
  showDemoLabel: boolean;
};

/** Thin inverse band above the header. Renders nothing when it has nothing to say. */
export function TopStrip({ showCoverageLine, showDemoLabel }: TopStripProps) {
  if (!showCoverageLine && !showDemoLabel) {
    return null;
  }

  return (
    <div className="bg-inverse-bg text-inverse-fg">
      <div className="page-container flex flex-wrap justify-between gap-4 py-2 text-[0.6875rem] tracking-[0.12em] uppercase">
        {showCoverageLine ? <p>{siteConfig.coverageLine}</p> : <span />}
        {showDemoLabel && <p className="text-inverse-accent">Conteúdo de demonstração</p>}
      </div>
    </div>
  );
}
