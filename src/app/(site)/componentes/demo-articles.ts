import type { ArticleCardData } from '@/components/cards/ArticleCard';
import { getArticlePath } from '@/lib/categories';

/*
 * Fictional demonstration data, taken from the approved mockups, used only by the component
 * preview. The page that imports it returns 404 unless SHOW_DEMO_CONTENT=true, so it never
 * reaches production (docs/adr/0004-demo-content-isolation.md). Real content comes from the
 * content layer in Stage 3.
 */

const FILIPE = { name: 'Filipe Braga' };
const ADRIANA = { name: 'Adriana Guimarães' };

export const featuredDemoArticle: ArticleCardData = {
  href: getArticlePath('film', 'a-mare-que-nao-volta'),
  title: 'A maré que não volta',
  kicker: 'Filmes · A casa das marés',
  excerpt:
    'Sobre casas que guardam ausências, planos que esperam demais e o tempo que uma imagem leva para se tornar memória.',
  authors: [FILIPE],
  publishedAt: '2026-11-12',
  readingTimeInMinutes: 11,
  cover: { kind: 'placeholder', caption: 'Still do filme · placeholder 16:10' },
};

export const recentDemoArticles: ArticleCardData[] = [
  {
    href: getArticlePath('series', 'o-labirinto-como-forma-de-contar'),
    title: 'O labirinto como forma de contar',
    kicker: 'Séries',
    excerpt: 'Quando a estrutura da temporada passa a ser o próprio enigma.',
    authors: [FILIPE],
    publishedAt: '2026-11-09',
    cover: { kind: 'placeholder', caption: 'Placeholder 3:2' },
  },
  {
    href: getArticlePath('book', 'escrever-para-quem-nao-vai-ler'),
    title: 'Escrever para quem não vai ler',
    kicker: 'Livros',
    excerpt: 'Um romance epistolar sobre o que fica guardado na gaveta.',
    authors: [ADRIANA],
    publishedAt: '2026-11-05',
    cover: { kind: 'fallback', title: 'As cartas que não mandei', kicker: 'Livros' },
  },
  {
    href: getArticlePath('film', 'o-medo-que-mora-no-corredor'),
    title: 'O medo que mora no corredor',
    kicker: 'Filmes',
    excerpt: 'Arquitetura, som e o horror do que não se mostra.',
    authors: [FILIPE, ADRIANA],
    publishedAt: '2026-11-01',
    cover: { kind: 'placeholder', caption: 'Placeholder 3:2' },
  },
];

export const essayDemoArticles: ArticleCardData[] = [
  {
    href: getArticlePath('essay', 'monstros-que-nos-explicam'),
    title: 'Monstros que nos explicam',
    kicker: 'Ensaios',
    authors: [FILIPE],
    publishedAt: '2026-10-28',
    readingTimeInMinutes: 24,
    cover: { kind: 'fallback', title: 'Monstros que nos explicam' },
  },
  {
    href: getArticlePath('essay', 'aprender-a-ler-o-silencio'),
    title: 'Aprender a ler o silêncio',
    kicker: 'Ensaios',
    authors: [ADRIANA],
    publishedAt: '2026-10-20',
    readingTimeInMinutes: 18,
    cover: { kind: 'fallback', title: 'Aprender a ler o silêncio' },
  },
];
