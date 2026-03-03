import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  formatters: true,
  markdown: true,
  stylistic: {
    quotes: 'single',
    semi: false,
  },
  ignores: ['dist/**', 'storybook-static/**', '**/CLAUDE.md'],
}, {
  files: ['stories/**/*.stories.tsx'],
  rules: {
    'no-alert': 'off',
    'no-console': 'off',
    'react-hooks/rules-of-hooks': 'off',
  },
})
