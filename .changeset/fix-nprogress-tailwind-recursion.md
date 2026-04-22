---
"@datum-cloud/datum-ui": patch
---

Fix Tailwind v4 CSS resolver recursion on the `@datum-cloud/datum-ui/nprogress` import.

**Problem**

Consumers importing `@datum-cloud/datum-ui/nprogress` from a Tailwind v4 stylesheet could hit:

```
[@tailwindcss/vite:generate:build] Exceeded maximum recursion depth while
resolving `nprogress/nprogress.css` in
`.../node_modules/@datum-cloud/datum-ui/dist/nprogress`
```

The shipped `dist/nprogress/nprogress.css` began with `@import 'nprogress/nprogress.css';` to pull in the upstream nprogress library styles. Under certain `node_modules` layouts, Tailwind v4's CSS resolver interpreted that bare specifier as colliding with the file's own containing directory (`.../nprogress/nprogress.css`) and recursed into itself.

**Fix**

Inline the upstream nprogress@0.2.0 base styles directly into `src/components/features/nprogress/nprogress.css`. The custom theme overrides (`--color-primary` bar, spinner, peg) are preserved below the inlined base. Visual output is unchanged.

No API changes — consumers keep `@import '@datum-cloud/datum-ui/nprogress'` as-is.
