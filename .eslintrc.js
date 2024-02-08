module.exports = {
  extends: [
    "@vercel/style-guide/eslint/browser",
    "@vercel/style-guide/eslint/react",
    "@vercel/style-guide/eslint/next",
		"@vercel/style-guide/eslint/typescript",
		"@vercel/style-guide/eslint/node",
  ].map(require.resolve),
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
  },
	settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  plugins: ['@typescript-eslint'],
  root: true,
};
