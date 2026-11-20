/**
 * Fails when a content file has `status: draft`. Drafts are never committed, because the
 * repository may be public (docs/adr/0004-demo-content-isolation.md).
 *
 * Usage: `node scripts/check-no-drafts.mjs [files...]`. Without arguments, checks every MDX
 * file under content/. lint-staged passes the staged files.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DRAFT_STATUS_PATTERN = /^status:\s*['"]?draft['"]?\s*$/m;
const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/;

async function listMdxFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

async function isDraft(filePath) {
  const fileContents = await readFile(filePath, 'utf8');
  const frontmatter = FRONTMATTER_PATTERN.exec(fileContents)?.[1] ?? '';
  return DRAFT_STATUS_PATTERN.test(frontmatter);
}

const requestedFiles = process.argv.slice(2);
const filesToCheck = requestedFiles.length > 0 ? requestedFiles : await listMdxFiles('content');
const draftFiles = [];

for (const filePath of filesToCheck) {
  if (await isDraft(filePath)) {
    draftFiles.push(filePath);
  }
}

if (draftFiles.length > 0) {
  console.error('Rascunhos não podem ser commitados (status: draft):');
  draftFiles.forEach((filePath) => console.error(`  - ${filePath}`));
  console.error('Mantenha o rascunho fora do Git até publicá-lo. Veja docs/como-publicar.md.');
  process.exit(1);
}
