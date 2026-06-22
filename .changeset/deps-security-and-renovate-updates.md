---
"@datum-cloud/datum-ui": patch
---

Update dependencies and apply a security fix.

- Override `undici` to `^7.28.0` to resolve a critical CRLF Injection
  vulnerability (pulled in transitively via jsdom, test-only).
- Apply open Renovate updates: `@radix-ui/*` primitives, storybook 10.4.6,
  `@types/react`, tsdown, `@rsbuild/core`.
- Bump remaining minor/patch deps: `@tiptap/*` 3.27, react-hook-form,
  `@conform-to/*`, `@tanstack/react-virtual`, lucide-react,
  isomorphic-dompurify, tailwindcss 4.3.1, eslint, vitest, turbo.
- Upgrade `js-yaml` to v5 (now imported via flat named exports; peer range
  widened to `>=4.1.1`).
- Bump the pinned package manager to pnpm 11.8.0.
