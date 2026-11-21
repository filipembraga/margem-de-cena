import conventionalConfig from '@commitlint/config-conventional';

import { noAiAttributionRule } from './scripts/commitlint/no-ai-attribution.mts';

const [conventionalLevel, conventionalApplicability, conventionalTypes] =
  conventionalConfig.rules['type-enum'];

/**
 * Conventional Commits, plus `content` for editorial changes (publishing or correcting a text),
 * so the history separates what the authors publish from changes to the code, and a local rule
 * that rejects AI attribution in the message (scripts/commitlint/no-ai-attribution.mts).
 *
 * @type {import('@commitlint/types').UserConfig}
 */
const commitlintConfig = {
  extends: ['@commitlint/config-conventional'],
  plugins: [{ rules: { 'no-ai-attribution': noAiAttributionRule } }],
  rules: {
    'type-enum': [conventionalLevel, conventionalApplicability, [...conventionalTypes, 'content']],
    'no-ai-attribution': [2, 'always'],
  },
};

export default commitlintConfig;
