import { test as base, expect, type ConsoleMessage } from '@playwright/test';

function isExpectedFailedRequest(message: ConsoleMessage, expectedFailedPaths: string[]): boolean {
  if (!message.text().startsWith('Failed to load resource')) {
    return false;
  }

  const failedPath = new URL(message.location().url).pathname;
  return expectedFailedPaths.includes(failedPath);
}

type Fixtures = {
  /** Paths a test requests on purpose knowing they fail, such as a 404 page under test. */
  expectedFailedPaths: string[];
  /** Fails the test if the page logs any console error or warning, hydration included. */
  failOnConsoleProblems: void;
};

export const test = base.extend<Fixtures>({
  expectedFailedPaths: [[], { option: true }],
  failOnConsoleProblems: [
    async ({ page, expectedFailedPaths }, use) => {
      const problems: string[] = [];

      page.on('console', (message) => {
        const isProblem = message.type() === 'error' || message.type() === 'warning';
        if (isProblem && !isExpectedFailedRequest(message, expectedFailedPaths)) {
          problems.push(`[console.${message.type()}] ${message.text()}`);
        }
      });
      page.on('pageerror', (error) => problems.push(`[page error] ${error.message}`));

      await use();

      expect(problems, 'The page logged console errors or warnings').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/**
 * One page of each kind, used by the smoke and accessibility suites. The suites run against
 * a build with demo content (playwright.config.ts), so these paths are demonstration entries.
 */
export const PAGES = [
  { path: '/', name: 'página inicial' },
  { path: '/filmes', name: 'arquivo de categoria' },
  { path: '/ensaios', name: 'arquivo de ensaios' },
  { path: '/filmes/a-mare-que-nao-volta', name: 'página de artigo' },
  { path: '/livros/a-gaveta-como-arquitetura-do-romance', name: 'artigo com imagem no texto' },
  { path: '/duas-leituras', name: 'arquivo de Duas Leituras' },
  { path: '/duas-leituras/a-casa-das-mares', name: 'página de Duas Leituras' },
  { path: '/autores/filipe-braga', name: 'página de autor' },
  { path: '/tags/memoria', name: 'página de etiqueta' },
  { path: '/sobre', name: 'página Sobre' },
  { path: '/privacidade', name: 'página institucional' },
  { path: '/busca', name: 'página de busca' },
  { path: '/styleguide', name: 'guia de estilo' },
] as const;

export const DESKTOP_BREAKPOINT = 1024;
