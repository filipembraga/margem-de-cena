import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { ArticleCard } from '@/components/cards/ArticleCard';
import { Wordmark } from '@/components/layout/Wordmark';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Cover } from '@/components/ui/Cover';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TagChip } from '@/components/ui/TagChip';
import { environment } from '@/lib/env';

import { essayDemoArticles, featuredDemoArticle, recentDemoArticles } from './demo-articles';

export const metadata: Metadata = {
  title: 'Componentes',
  description: 'Prévia dos componentes visuais da Margem de Cena.',
  robots: { index: false, follow: false },
};

const COLOR_TOKENS = [
  { token: '--bg', label: 'Papel', swatchClassName: 'bg-bg' },
  { token: '--fg', label: 'Carvão', swatchClassName: 'bg-fg' },
  { token: '--fg-soft', label: 'Texto secundário', swatchClassName: 'bg-fg-soft' },
  { token: '--muted', label: 'Cinza de leitura', swatchClassName: 'bg-muted' },
  { token: '--muted-lg', label: 'Cinza (só texto grande)', swatchClassName: 'bg-muted-lg' },
  { token: '--line', label: 'Fios e placeholders', swatchClassName: 'bg-line' },
  { token: '--band', label: 'Faixas', swatchClassName: 'bg-band' },
  { token: '--accent', label: 'Bordô', swatchClassName: 'bg-accent' },
  { token: '--highlight', label: 'Grifo', swatchClassName: 'bg-highlight' },
  { token: '--inverse-bg', label: 'Fundo invertido', swatchClassName: 'bg-inverse-bg' },
  { token: '--inverse-accent', label: 'Acento no invertido', swatchClassName: 'bg-inverse-accent' },
] as const;

const TYPE_STYLES = [
  { className: 'type-article-title', label: 'Título de artigo', sample: 'A maré que não volta' },
  { className: 'type-hero-title', label: 'Título de destaque', sample: 'A maré que não volta' },
  { className: 'type-section-title', label: 'Título de seção', sample: 'A casa como personagem' },
  {
    className: 'type-card-title',
    label: 'Título de card',
    sample: 'O labirinto como forma de contar',
  },
  {
    className: 'type-standfirst text-fg-soft',
    label: 'Linha fina',
    sample:
      'Sobre casas que guardam ausências e o tempo que uma imagem leva para se tornar memória.',
  },
  {
    className: 'type-quote',
    label: 'Citação',
    sample: 'Uma casa vazia filmada com paciência é uma frase que se recusa a terminar.',
  },
  {
    className: 'type-note text-accent',
    label: 'Nota de margem',
    sample: 'Repare na porta entreaberta.',
  },
  {
    className: 'type-body max-w-[42.5rem]',
    label: 'Corpo do texto',
    sample:
      'Há filmes que terminam quando a tela escurece, e há outros que apenas mudam de lugar. A casa das marés pertence ao segundo grupo: sua última imagem não encerra nada.',
  },
  { className: 'type-kicker text-accent', label: 'Kicker', sample: 'Filmes · Duas Leituras' },
  { className: 'type-nav', label: 'Navegação', sample: 'Filmes   Livros   Séries' },
  {
    className: 'type-meta text-muted',
    label: 'Metadados',
    sample: 'Por Filipe Braga · 12 nov 2026 · 11 min',
  },
  {
    className: 'type-caption text-muted',
    label: 'Legenda',
    sample: 'Imagem de capa · [créditos e licença]',
  },
] as const;

/**
 * Living style guide for Stage 2. Available only where demo content is allowed, so it is a
 * 404 in production.
 */
export default function ComponentPreviewPage() {
  if (!environment.showDemoContent) {
    notFound();
  }

  return (
    <div className="page-container flex flex-col gap-22 py-14 sm:py-18">
      <header className="flex flex-col gap-4">
        <p className="type-kicker text-accent">Design system v0.1</p>
        <h1 className="type-hero-title">Componentes</h1>
        <p className="max-w-2xl type-excerpt-large text-fg-soft">
          Tokens, tipografia e componentes-base da Margem de Cena, nos temas claro e escuro. Todo o
          conteúdo desta página é fictício.
        </p>
      </header>

      <PreviewSection id="marca" title="Marca">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex min-h-72 items-center justify-center border border-line p-8">
            <Wordmark layout="stacked" size="display" />
          </div>
          <div className="grid gap-6">
            <div className="flex min-h-36 items-center justify-center bg-inverse-bg p-6">
              <Wordmark size="header" tone="inverse" withMarginRule={false} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex min-h-36 items-center justify-center bg-band">
                <Wordmark layout="monogram" size="display" />
              </div>
              <div className="flex min-h-36 flex-col items-center justify-center gap-2 border border-line">
                <span className="flex size-18 items-center justify-center rounded-full bg-accent font-display text-[2.5rem] leading-none font-medium text-accent-ink">
                  M<span className="font-normal italic">c</span>
                </span>
                <span className="type-caption text-muted">avatar</span>
              </div>
            </div>
          </div>
        </div>
      </PreviewSection>

      <PreviewSection id="cores" title="Cores">
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {COLOR_TOKENS.map((color) => (
            <li key={color.token} className="flex flex-col gap-2">
              <span className={`block aspect-[4/3] border border-line ${color.swatchClassName}`} />
              <span className="type-meta font-medium">{color.label}</span>
              <code className="type-caption text-muted">{color.token}</code>
            </li>
          ))}
        </ul>
      </PreviewSection>

      <PreviewSection id="tipografia" title="Tipografia">
        <dl className="flex flex-col">
          {TYPE_STYLES.map((style) => (
            <div
              key={style.className}
              className="grid gap-2 border-b border-line py-6 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8"
            >
              <dt className="type-caption text-muted">{style.label}</dt>
              <dd className={style.className}>{style.sample}</dd>
            </div>
          ))}
        </dl>
      </PreviewSection>

      <PreviewSection id="elementos" title="Elementos de texto">
        <div className="grid gap-12 md:grid-cols-2">
          <p className="type-body">
            Nada ali é dito em voz alta, e <mark>é justamente o silêncio que organiza a cena</mark>,
            como um parágrafo que nos obriga a{' '}
            <a href="#elementos" className="link-body">
              voltar uma linha
            </a>
            .
          </p>
          <blockquote className="border-l-2 border-accent pl-6 type-quote">
            Uma casa vazia filmada com paciência é uma frase que se recusa a terminar.
          </blockquote>
          <aside className="border-l-2 border-accent pl-4 type-note text-accent">
            <sup className="pr-1 font-ui text-xs not-italic">1</sup>O plano final repete o primeiro,
            agora sem a personagem.
          </aside>
          <p
            aria-hidden="true"
            className="text-center font-display text-2xl tracking-[0.6em] text-muted"
          >
            · · ·
          </p>
        </div>
      </PreviewSection>

      <PreviewSection id="botoes" title="Botões e etiquetas">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="#botoes">Ler artigo</ButtonLink>
            <ButtonLink href="#botoes" variant="secondary">
              Ver arquivo
            </ButtonLink>
            <Button variant="accent">Revelar trecho</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <TagChip name="memória" />
            <TagChip name="luto" />
            <TagChip name="Alice Hoffman" />
            <TagChip name="Duas Leituras" tone="highlight" asLabel />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-6 bg-inverse-bg p-8">
            <p className="font-display text-[2rem] leading-tight text-inverse-fg sm:text-[2.5rem]">
              Trechos, bastidores e as notas que não couberam na margem.
            </p>
            <ButtonLink href="#botoes" variant="inverse">
              Seguir no Instagram
            </ButtonLink>
          </div>
        </div>
      </PreviewSection>

      <PreviewSection id="cards" title="Cards de artigo">
        <div className="flex flex-col gap-18">
          <ArticleCard article={featuredDemoArticle} variant="featured" />

          <div className="grid grid-cols-[repeat(auto-fit,minmax(16.25rem,1fr))] gap-x-8 gap-y-10">
            {recentDemoArticles.map((article) => (
              <ArticleCard key={article.href} article={article} />
            ))}
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <SectionHeading
                variant="display"
                title="Filmes"
                headingLevel="h3"
                link={{ label: 'Arquivo', href: '/filmes' }}
              />
              {recentDemoArticles.map((article) => (
                <ArticleCard
                  key={article.href}
                  article={article}
                  variant="compact"
                  headingLevel="h4"
                />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <SectionHeading variant="display" title="Livros" headingLevel="h3" />
              <div className="flex items-end gap-4.5">
                <Cover
                  source={{ kind: 'fallback', title: 'As cartas que não mandei' }}
                  aspectRatio="2:3"
                  className="w-28 shrink-0"
                />
                <p className="type-caption text-muted">
                  Capa do livro em proporção real, sem moldura de vitrine.
                </p>
              </div>
            </div>
          </div>

          <div>
            <SectionHeading title="Ensaios" aside="textos longos e temáticos" headingLevel="h3" />
            {essayDemoArticles.map((article, index) => (
              <ArticleCard
                key={article.href}
                article={article}
                variant="numbered"
                position={index + 1}
                headingLevel="h4"
              />
            ))}
          </div>
        </div>
      </PreviewSection>

      <PreviewSection id="vazio" title="Estado vazio">
        <EmptyState
          title="Por enquanto, nada publicado nesta seção."
          description="Quando o primeiro texto chegar, ele aparece aqui."
        />
      </PreviewSection>
    </div>
  );
}

function PreviewSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-titulo`} className="flex flex-col gap-9">
      <SectionHeading id={`${id}-titulo`} title={title} />
      {children}
    </section>
  );
}
