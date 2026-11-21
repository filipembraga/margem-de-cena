/**
 * Lists the "[A PREENCHER: …]" markers left in the published content (author bios,
 * institutional pages), so nothing provisional goes live unnoticed. Demonstration content is
 * not checked.
 *
 * Usage: `node scripts/list-placeholders.mjs [--strict]`
 * - default: prints each marker and exits with success (in CI, as warnings on the files);
 * - `--strict`: fails when any marker is left, for the launch checklist.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const CONTENT_DIRECTORY = 'content';
const DEMO_DIRECTORY = path.join(CONTENT_DIRECTORY, 'demo');
const CONTENT_EXTENSIONS = new Set(['.mdx', '.yaml']);
const PLACEHOLDER_MARKER = '[A PREENCHER';

const isStrict = process.argv.includes('--strict');
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

async function listContentFiles() {
  const entries = await readdir(CONTENT_DIRECTORY, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && CONTENT_EXTENSIONS.has(path.extname(entry.name)))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .filter((filePath) => !filePath.startsWith(DEMO_DIRECTORY + path.sep))
    .sort();
}

async function findPlaceholders(filePath) {
  const lines = (await readFile(filePath, 'utf8')).split('\n');
  return lines
    .map((line, index) => ({ filePath, lineNumber: index + 1, text: line.trim() }))
    .filter(({ text }) => text.includes(PLACEHOLDER_MARKER));
}

const placeholders = (await Promise.all((await listContentFiles()).map(findPlaceholders))).flat();

for (const { filePath, lineNumber, text } of placeholders) {
  if (isGitHubActions) {
    console.log(`::warning file=${filePath},line=${lineNumber}::Texto a preencher: ${text}`);
  } else {
    console.log(`${filePath}:${lineNumber}  ${text}`);
  }
}

if (placeholders.length === 0) {
  console.log('Nenhum texto a preencher.');
} else {
  console.log(`\n${placeholders.length} texto(s) a preencher antes do lançamento.`);
  if (isStrict) {
    process.exitCode = 1;
  }
}
