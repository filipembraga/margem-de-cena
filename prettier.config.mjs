/** @type {import('prettier').Config} */
const prettierConfig = {
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/app/globals.css',
  tailwindFunctions: ['classNames'],
};

export default prettierConfig;
