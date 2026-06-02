---
'@datum-cloud/datum-ui': patch
---

Update dependencies across the workspace, including four major upgrades, with the affected components migrated.

- Minor & patch bumps for ~37 packages (react 19.2.7, recharts 3.8.1, zod 4.4.3, react-hook-form 7.77, motion 12.40, tiptap 3.24, storybook 10.4.1, next 16.2.7, turbo 2.9.16, and others).
- `@antfu/eslint-config` v8 → v9 and `@eslint-react/eslint-plugin` v3 → v5 (removed the obsolete `react/component-hook-factories` rule override).
- `fumadocs-mdx` v14 → v15 (Vite/rolldown bundler; no config changes needed).
- `react-day-picker` v9 → v10: Calendar migrated to the v10 API — `month_grid` classNames key, `startMonth`/`endMonth` navigation props, and `autoFocus`. Behavior is unchanged.

Compatibility fixes: `recharts` 3.8 chart tooltip key coercion. Test setup gains a jsdom `elementFromPoint` polyfill for tiptap 3.24.
