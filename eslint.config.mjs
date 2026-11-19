import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

// Rules that back docs/engineering-conventions.md. Formatting is left to Prettier.
const readabilityRules = {
  // Callback parameters and variables get real names (`article`, not `a`).
  'id-length': ['error', { min: 2, exceptions: ['_'], properties: 'never' }],
  'no-nested-ternary': 'error',
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
  ],
};

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    files: ['**/*.{ts,tsx,mts}'],
    rules: readabilityRules,
  },
  {
    // Module boundaries outside React components declare their types explicitly.
    files: ['src/lib/**/*.ts', 'src/content/**/*.ts'],
    ignores: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'error',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
  ]),
]);
