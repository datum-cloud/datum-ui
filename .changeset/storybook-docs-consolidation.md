---
"@repo/storybook": major
---

Consolidate all documentation into Storybook and remove the standalone fumadocs app.

Storybook is now the single documentation surface:

- Component usage docs (prose + examples) migrated into each story via `parameters.docs.description` and example stories.
- MDX guide pages: Introduction, Installation, Theming, Providers, and the Picker migration guide.
- Hook docs with live demos: `useCopyToClipboard`, `useDebounce`.
- New stories for previously undocumented components: `StatCard`, `Combobox`, `Sidebar`.
- Docs pages follow dark mode via a theme-aware `DocsContainer`.

BREAKING CHANGE: the fumadocs app (`apps/docs`) has been removed.
