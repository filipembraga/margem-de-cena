import conventionalConfig from '@commitlint/config-conventional';

const [conventionalLevel, conventionalApplicability, conventionalTypes] =
  conventionalConfig.rules['type-enum'];

/**
 * Conventional Commits, plus `content` for editorial changes (publishing or correcting a text),
 * so the history separates what the authors publish from changes to the code.
 *
 * @type {import('@commitlint/types').UserConfig}
 */
const commitlintConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [conventionalLevel, conventionalApplicability, [...conventionalTypes, 'content']],
  },
};

export default commitlintConfig;
