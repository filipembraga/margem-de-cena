/**
 * Commit messages carry no AI attribution (CLAUDE.md, working agreement): no `Co-Authored-By`
 * trailer naming Claude or Anthropic, and no "Generated with" line. The rule runs in the
 * commit-msg hook and again in CI, so a commit made with `--no-verify` is still caught.
 */

type AttributionPattern = {
  pattern: RegExp;
  description: string;
};

const ATTRIBUTION_PATTERNS: AttributionPattern[] = [
  {
    pattern: /^\s*co-authored-by:.*\b(claude|anthropic)\b/im,
    description: 'a Co-Authored-By trailer naming Claude or Anthropic',
  },
  {
    pattern: /generated with/i,
    description: 'a "Generated with" line',
  },
];

/** Returns the kind of attribution found in a commit message, or `null` when there is none. */
export function findAiAttribution(message: string): string | null {
  const match = ATTRIBUTION_PATTERNS.find(({ pattern }) => pattern.test(message));
  return match ? match.description : null;
}

type ParsedCommit = { raw?: string | null };

/** commitlint rule: returns `[isValid, message]`. */
export function noAiAttributionRule(parsedCommit: ParsedCommit): [boolean, string] {
  const attribution = findAiAttribution(parsedCommit.raw ?? '');
  return [
    attribution === null,
    `commit messages must not contain AI attribution (found ${attribution})`,
  ];
}
