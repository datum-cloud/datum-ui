---
"@datum-cloud/datum-ui": minor
---

Refresh dependencies across the workspace. No component API changed and no peer range moved, so this is a drop-in upgrade.

**No action required.** Every bump below lands inside the existing peer ranges — `ai` stays `>=7 <8`, `nuqs` stays `>=2 <3`, `lucide-react` stays `>=1 <2`, and so on. If you are already on a supported version you do not need to change anything.

Runtime dependency:

- `isomorphic-dompurify` `3.21.0` → `3.22.0`.

Peer-facing packages, all patch- or minor-level within their current ranges:

- `ai` `7.0.48` → `7.0.66`, `nuqs` `2.9.4` → `2.9.6`, `sonner` `2.0.7` → `2.0.8`.
- `@tiptap/*` `3.29.2` → `3.30.1` — character-count, link, placeholder, underline, react, starter-kit.
- `@conform-to/react` and `@conform-to/zod` `1.20.2` → `1.21.0`.
- `lucide-react` `1.28.0` → `1.31.0`, `react-hook-form` `7.84.0` → `7.85.0`, `react-dropzone` `20.0.0` → `20.1.0`, `js-yaml` `5.2.3` → `5.3.0`.

Security — transitive pins raised in `pnpm-workspace.yaml`:

- `brace-expansion` `1.1.17` → `1.1.18` on the `>=1.0.0 <1.1.17` line, clearing the remaining GHSA HIGH on the 1.x copy.
- `postcss` `8.5.25` → `8.5.26` and `next` `16.2.12` → `16.3.1`.

Tooling, with no effect on consumers: `@antfu/eslint-config` `9.3.0`, `@eslint-react/eslint-plugin` `5.18.6`, `eslint` `10.8.1`, `@changesets/cli` `3.0.0`, `turbo` `2.10.10`, Storybook `10.5.8`, `@rsbuild/core` `2.1.13`, and pnpm `11.22.0`.

**TypeScript stays on 6.0.3.** TypeScript 7.0 ships without a public programmatic compiler API, and `typescript-eslint@8` declares peer `typescript >=4.8.4 <6.1.0`, so TS 7 breaks linting for the whole workspace. Renovate is now capped at `<7` until the API lands in TS 7.1.

All 1016 tests pass; lint reports 0 errors, unchanged from `main`.
