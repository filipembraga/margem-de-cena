import { test as base, expect, type ConsoleMessage } from '@playwright/test';

/**
 * Routes linked from the header and footer that are built in Stage 3. Next.js prefetches
 * every visible link, so until these pages exist the browser logs a 404 for each of them.
 * Remove entries as the routes ship; the list must be empty by the end of Stage 3.
 */
const ROUTES_PENDING_IMPLEMENTATION = [
  '/filmes',
  '/livros',
  '/series',
  '/duas-leituras',
  '/ensaios',
  '/sobre',
  '/busca',
  '/contato',
  '/privacidade',
  '/creditos',
];

function isExpectedFailedRequest(message: ConsoleMessage, expectedFailedPaths: string[]): boolean {
  if (!message.text().startsWith('Failed to load resource')) {
    return false;
  }

  const failedPath = new URL(message.location().url).pathname;
  return [...ROUTES_PENDING_IMPLEMENTATION, ...expectedFailedPaths].includes(failedPath);
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

/** Pages that exist in this stage, used by the smoke and accessibility suites. */
export const PAGES = [
  { path: '/', name: 'página inicial' },
  { path: '/componentes', name: 'prévia de componentes' },
] as const;

export const DESKTOP_BREAKPOINT = 1024;
