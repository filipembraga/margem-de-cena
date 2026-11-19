import Link from 'next/link';

import { footerNavigation, siteConfig } from '@/lib/site-config';

import { Wordmark } from './Wordmark';

/** Visible placeholder until the authors provide a contact address. */
const CONTACT_EMAIL_PLACEHOLDER = '[contato@dominio]';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="page-container flex flex-col gap-8 pt-14 pb-10">
      <div className="flex flex-wrap justify-between gap-8">
        <Wordmark layout="stacked" size="footer" />
        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-7 gap-y-3 type-meta">
            {footerNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block py-1 underline decoration-1 underline-offset-4 hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-4 type-meta-small text-muted">
        <p>
          Publicação cultural independente · {siteConfig.contactEmail ?? CONTACT_EMAIL_PLACEHOLDER}
        </p>
        <p>
          © {currentYear} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
