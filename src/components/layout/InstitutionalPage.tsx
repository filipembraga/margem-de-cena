import type { ReactNode } from 'react';

import { ArticleBody } from '@/components/mdx/ArticleBody';
import type { Page } from '@/content';

import { PageHeader } from './PageHeader';

type InstitutionalPageProps = {
  page: Page;
  /** Extra sections after the text, such as the authors on the Sobre page. */
  children?: ReactNode;
};

/** Sobre, Contato, Privacidade and Créditos: a title and an MDX text in the reading column. */
export function InstitutionalPage({ page, children }: InstitutionalPageProps) {
  return (
    <div className="page-container pb-22">
      <PageHeader title={page.title} />
      <ArticleBody body={page.body} className="max-w-170 pt-12" />
      {children}
    </div>
  );
}
