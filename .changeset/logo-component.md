---
"@datum-cloud/datum-ui": minor
---

Adds a new Datum logo component family at `@datum-cloud/datum-ui/logo`:

- `Logo.Flat` — horizontal lockup (D mark + Datum wordmark)
- `Logo.Stacked` — vertical lockup
- `Logo.Icon` — standalone D mark
- `Logo.Text` — "Datum" wordmark only

Each component supports four tones via the `tone` prop:

- `brand` (default) — navy text `#0C1D31` + rose mark `#BF9595`, for light surfaces
- `mono-light` — lime mark `#E6F59F` + white text, for placement on dark or coloured surfaces (matches the source `Logo - flat - light.svg`)
- `mono-dark` — solid navy, monochrome for light surfaces
- `white` — solid white, for photographic or strongly coloured surfaces where the lime accent would clash (matches the source `Logo - flat - white - light.svg`)

Sizing is driven entirely by consumer Tailwind classes (e.g. `className="h-8 w-auto"`, `size-8`). Each component is accessible by default with `role="img"` and `aria-label="Datum"`, both overridable; pass `decorative` to set `aria-hidden` when the logo sits next to brand text.

A theme-aware adapter is available at `@datum-cloud/datum-ui/logo/themed` (`ThemedLogo.Flat`/`.Stacked`/`.Icon`). It reads from `useTheme()` and renders `brand` on light theme, `mono-light` on dark theme, falling back to `brand` during SSR via `ClientOnly`. Consumers without a theme system can use the core `Logo.*` components without the optional theme peer dependency.
