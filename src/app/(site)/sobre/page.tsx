import type { Metadata } from 'next';

import { AuthorCard } from '@/components/cards/AuthorCard';
import { InstitutionalPage } from '@/components/layout/InstitutionalPage';
import { getAuthors, getPage } from '@/content';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('sobre');
  return { title: page.title, description: page.description };
}

/** The publication, its name and philosophy, then both authors. */
export default async function AboutPage() {
  const [page, authors] = await Promise.all([getPage('sobre'), getAuthors()]);

  return (
    <InstitutionalPage page={page}>
      <section aria-labelledby="quem-escreve" className="flex flex-col gap-8 pt-18">
        <h2 id="quem-escreve" className="pt-3 type-label rule-double-top">
          Quem escreve
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {authors.map((author) => (
            <AuthorCard key={author.slug} author={author} />
          ))}
        </div>
      </section>
    </InstitutionalPage>
  );
}
