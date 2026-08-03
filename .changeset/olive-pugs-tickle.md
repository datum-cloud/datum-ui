---
"@datum-cloud/datum-ui": minor
---

Refresh runtime dependencies and raise the `js-yaml` peer floor past a known advisory.

**Action required if you depend on `js-yaml`.** The peer range moves from `>=5 <6` to `>=5.2.2 <6`. Versions `5.0.0` through `5.2.1` carry a HIGH advisory, and the old floor allowed them. If you pin `js-yaml` below `5.2.2` you will now see a peer warning — upgrade to `5.2.2` or later.

**`react-dropzone` support widened to v20.** The peer range moves from `>=15 <16` to `>=15 <21`, so v15 through v20 are all accepted. This is additive — if you stay on v15 nothing changes. v20 adds an `AcceptGroup[]` form for `accept` alongside the existing object form, and `Dropzone`'s auto-generated caption now handles both.

Everything else here is a patch- or minor-level bump within existing ranges and needs no action:

- **16 Radix primitives** — avatar, checkbox, collapsible, dialog, dropdown-menu, hover-card, label, popover, radio-group, select, separator, slot, switch, tabs, tooltip, visually-hidden. `@radix-ui/react-slot` lands on `1.3.3`, clearing the RSC regression present in `1.3.1`/`1.3.2`.
- `isomorphic-dompurify` `3.18.0` → `3.21.0`, which clears the transitive `dompurify` advisories.
- `lucide-react` `1.21.0` → `1.28.0`, `recharts` `3.8.1` → `3.10.1`, `@tanstack/react-virtual` `3.14.3` → `3.14.9`, `motion` `12.40.0` → `12.43.0`, `nuqs` `2.8.9` → `2.9.4`, `react-hook-form` `7.80.0` → `7.84.0`, `leaflet.fullscreen` `5.3.1` → `5.3.3`.
- Editor and form stacks: `@tiptap/*` `3.27.1` → `3.29.2`, `@conform-to/react` and `@conform-to/zod` `1.19.4` → `1.20.2`, `@hookform/resolvers` `5.4.0` → `5.7.1`, `ai` `7.0.0` → `7.0.48`.

No component API changed. All 1016 tests pass.
