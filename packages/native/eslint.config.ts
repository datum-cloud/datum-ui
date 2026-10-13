import { createConfig } from '@repo/config/eslint'

export default Promise.resolve(createConfig({ markdown: false })).then(config => [
  ...config,
  {
    // CommonJS tooling config (babel / jest) and Metro asset requires.
    files: ['*.js', 'test/**/*.{js,cjs}', 'src/**/*.{ts,tsx}'],
    rules: {
      'ts/no-require-imports': 'off',
    },
  },
])
