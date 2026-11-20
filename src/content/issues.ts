/**
 * Problems found while loading content. They are collected across every file and reported
 * together, in pt-BR, so an author can fix them all from one build output.
 */

export type ContentIssue = {
  /** File the problem belongs to, e.g. `content/articles/a-mare-que-nao-volta.mdx`. */
  origin: string;
  message: string;
  /** Line inside the MDX body, when known. */
  line?: number | null;
};

export class ContentValidationError extends Error {
  readonly issues: ContentIssue[];

  constructor(issues: ContentIssue[]) {
    super(formatIssues(issues));
    this.name = 'ContentValidationError';
    this.issues = issues;
  }
}

function formatIssues(issues: ContentIssue[]): string {
  const heading =
    issues.length === 1
      ? 'O conteúdo tem 1 problema:'
      : `O conteúdo tem ${issues.length} problemas:`;
  const lines = issues.map((issue) => {
    const location = issue.line ? `${issue.origin} (linha ${issue.line})` : issue.origin;
    return `  - ${location}: ${issue.message}`;
  });

  return [heading, ...lines].join('\n');
}
