import { createConfig } from '@repo/config/eslint'

// createConfig returns a (thenable) flat-config composer; ESLint accepts a promise.
export default Promise.resolve(createConfig({ markdown: false })).then(config => [
  // Generated from the CSS; formatting is owned by scripts/lib/serialize.mjs.
  { ignores: ['src/tokens.gen.ts'] },
  ...config,
])
