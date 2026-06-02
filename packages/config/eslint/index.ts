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
  }).append({
    rules: {
      // Demoted to warn after the @antfu/eslint-config 4 → 8 jump promoted
      // these. Library code is not HMR'd; factory and test-harness patterns
      // are intentional. Re-tighten case-by-case in follow-up PRs.
      // Note: react/component-hook-factories was removed in @eslint-react v5.
      'react-refresh/only-export-components': 'warn',
      'react/exhaustive-deps': 'warn',
      'react/set-state-in-effect': 'warn',
    },
  }) as unknown as Linter.Config[]
}
