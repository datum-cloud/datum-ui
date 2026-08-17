import { createConfig } from '@repo/config/eslint'

// Flat ESLint config for @repo/shadcn. Referenced explicitly via the `lint`
// script (`eslint . --config lint.config.ts`) because the standard
// `eslint.config.ts` filename is guarded by repo tooling.
export default createConfig({ react: true, markdown: false })
