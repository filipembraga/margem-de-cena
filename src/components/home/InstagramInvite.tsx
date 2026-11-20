import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { getInstagramUrl } from '@/lib/site-config';

type InstagramInviteProps = {
  handle: string;
};

/** Inverse band inviting readers to follow the publication on Instagram. */
export function InstagramInvite({ handle }: InstagramInviteProps) {
  return (
    <section aria-labelledby="no-instagram" className="bg-inverse-bg text-inverse-fg">
      <div className="page-container flex flex-wrap items-center justify-between gap-8 py-12">
        <div className="flex flex-col gap-2.5">
          <h2 id="no-instagram" className="type-label text-inverse-accent">
            No Instagram
          </h2>
          <p className="font-display text-[1.75rem] leading-tight sm:text-4xl">
            Trechos, bastidores e as notas que não couberam na margem.
          </p>
        </div>
        <a
          href={getInstagramUrl(handle)}
          rel="noopener noreferrer"
          target="_blank"
          className="inline-flex min-h-11 items-center gap-2.5 border border-inverse-fg px-5 text-[0.8125rem] font-medium hover:border-inverse-accent hover:text-inverse-accent"
        >
          <InstagramIcon />
          Seguir @{handle}
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
    </section>
  );
}
