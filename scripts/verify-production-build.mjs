/**
 * Runs after a production build (SHOW_DEMO_CONTENT=false) and fails if demonstration content
 * reached the output: no page may carry the demo label, and no demo article, work or Duas
 * Leituras entry may have been generated (docs/adr/0004-demo-content-isolation.md).
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const BUILD_OUTPUT_DIRECTORY = '.next/server/app';
const DEMO_CONTENT_DIRECTORY = 'content/demo';
const DEMO_LABEL = 'Conteúdo de demonstração';

async function listFiles(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

const demoSlugs = new Set(
  [
    ...(await listFiles(DEMO_CONTENT_DIRECTORY, '.mdx')),
    ...(await listFiles(DEMO_CONTENT_DIRECTORY, '.yaml')),
  ].map((filePath) => path.basename(filePath, path.extname(filePath))),
);
const generatedPages = await listFiles(BUILD_OUTPUT_DIRECTORY, '.html');
const problems = [];

for (const pagePath of generatedPages) {
  if (demoSlugs.has(path.basename(pagePath, '.html'))) {
    problems.push(`demo page was generated: ${pagePath}`);
  }
  if ((await readFile(pagePath, 'utf8')).includes(DEMO_LABEL)) {
    problems.push(`page shows the demo label: ${pagePath}`);
  }
}

if (generatedPages.length === 0) {
  problems.push(`no pages found in ${BUILD_OUTPUT_DIRECTORY}; run "pnpm build" first`);
}

if (problems.length > 0) {
  console.error('Demonstration content leaked into the production build:');
  problems.forEach((problem) => console.error(`  - ${problem}`));
  process.exit(1);
}

console.log(`Checked ${generatedPages.length} pages: no demonstration content.`);
