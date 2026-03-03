import antfu from '@antfu/eslint-config'
import type { Linter } from 'eslint'

export function createConfig(options?: { react?: boolean, markdown?: boolean }): Linter.Config[] {
  return antfu({
    react: options?.react ?? true,
    typescript: true,
    formatters: true,
    markdown: options?.markdown ?? true,
    stylistic: {
      quotes: 'single',
      semi: false,
    },
    ignores: ['dist/**', 'storybook-static/**', '.next/**', 'coverage/**', '**/CLAUDE.md'],
  }) as unknown as Linter.Config[]
}
