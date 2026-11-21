import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { getInstagramUrl } from '@/lib/site-config';

export type InstagramProfile = {
  /** Handle without "@". */
  handle: string;
  /** Whose profile it is, read by screen readers after the handle, e.g. "Filipe Braga". */
  ownerName: string;
};

type InstagramInviteProps = {
  /**
   * The publication's own profile, or the authors' profiles while the publication has none
   * (`siteConfig.instagramHandle` is null).
   */
  profiles: InstagramProfile[];
  isAuthorProfiles: boolean;
};

/** Inverse band inviting readers to follow the publication, or its authors, on Instagram. */
export function InstagramInvite({ profiles, isAuthorProfiles }: InstagramInviteProps) {
  if (profiles.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="no-instagram" className="bg-inverse-bg text-inverse-fg">
      <div className="page-container flex flex-wrap items-center justify-between gap-8 py-12">
        <div className="flex flex-col gap-2.5">
          <h2 id="no-instagram" className="type-label text-inverse-accent">
            No Instagram
          </h2>
          <p className="font-display text-[1.75rem] leading-tight sm:text-4xl">
            {isAuthorProfiles
              ? 'Trechos, bastidores e as notas que não couberam na margem, nos perfis de quem escreve.'
              : 'Trechos, bastidores e as notas que não couberam na margem.'}
          </p>
        </div>
        <ul className="flex flex-wrap gap-3">
          {profiles.map((profile) => (
            <li key={profile.handle}>
              <a
                href={getInstagramUrl(profile.handle)}
                rel="noopener noreferrer"
                target="_blank"
                className="inline-flex min-h-11 items-center gap-2.5 border border-inverse-fg px-5 text-[0.8125rem] font-medium hover:border-inverse-accent hover:text-inverse-accent"
              >
                <InstagramIcon />
                Seguir @{profile.handle}
                <span className="sr-only">
                  {` (perfil de ${profile.ownerName}; abre em nova aba)`}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
