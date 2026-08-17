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
  }).append(
    // Architectural layering enforcement for the datum-ui component tree
    // (shadcn primitives -> base -> features). Scoped by path globs so these
    // blocks are inert in every other workspace package. `@repo/shadcn` is a
    // shared primitive layer both `base` and `features` may consume, so it is
    // intentionally NOT restricted.
    {
      name: 'datum-ui/layering/base-no-features',
      files: ['**/src/components/base/**'],
      ignores: ['**/__tests__/**'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [{
            group: ['**/features/*', '**/features/**', '**/components/features/**'],
            message: 'Layering: base/ components must not import from features/. Move shared code down into base/ or a shared module.',
          }],
        }],
      },
    },
    {
      name: 'datum-ui/layering/features-base-barrel-only',
      files: ['**/src/components/features/**'],
      ignores: ['**/__tests__/**'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [{
            group: ['**/base/*/*', '**/base/*/*/**'],
            message: 'Layering: import base components from their barrel (base/<name>), not their internal files (base/<name>/<file>).',
          }],
        }],
      },
    },
  ) as unknown as Linter.Config[]
}
