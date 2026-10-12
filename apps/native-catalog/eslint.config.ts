import { createConfig } from '@repo/config/eslint'

export default Promise.resolve(createConfig({ markdown: false })).then(config => [
  { ignores: ['ios/**', 'android/**', '.expo/**', 'expo-env.d.ts'] },
  ...config,
  {
    files: ['*.js'],
    rules: { 'ts/no-require-imports': 'off' },
  },
])
