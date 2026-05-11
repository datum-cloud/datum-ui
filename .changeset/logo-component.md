---
"@datum-cloud/datum-ui": minor
---

This release bundles a new Datum logo component family, a `Form.Stepper`
validation-error fix, a new `AppNavigation` customisation API, an
adapter-aware zod schema convention used by the demo stories, and a
routine minor/patch dependency bump.

## New — Datum logo at `@datum-cloud/datum-ui/logo`

Four SVG components under a single `Logo` namespace:

- `Logo.Flat` — horizontal lockup (D mark + Datum wordmark)
- `Logo.Stacked` — vertical lockup
- `Logo.Icon` — standalone D mark
- `Logo.Text` — "Datum" wordmark only (cropped viewBox)

Each component accepts a `tone` prop with four values:

| Tone | Use case |
| --- | --- |
| `brand` (default) | Navy text `#0C1D31` + rose mark `#BF9595` — light surfaces |
| `mono-light` | Lime mark `#E6F59F` + white text — dark surfaces |
| `mono-dark` | Solid navy — monochrome on light surfaces |
| `white` | Solid white — photographic / strongly coloured surfaces |

Sizing is driven entirely by Tailwind classes (`h-8 w-auto`, `size-12`,
etc.). Default a11y is `role="img"` + `aria-label="Datum"`; pass
`decorative` to set `aria-hidden` when the logo sits beside brand text.

A theme-aware adapter ships separately at `@datum-cloud/datum-ui/logo/themed`
(`ThemedLogo.{Flat,Stacked,Icon,Text}`). It picks `brand` on light
theme and `mono-light` on dark theme via `useTheme()`, with a
`ClientOnly` fallback for SSR safety. Consumers without a theme
system can use the core `Logo.*` components — no optional peer needed.

## Fixed — `Form.Stepper` hid zod validation errors on Next click

The stepper's `<form>` submit handler did not call
`markAllFieldsTouched()` the way `Form.Root` does, so the display-touched
gate kept zod-derived errors hidden — only the autofocus on the first
invalid input fired. The handler now mirrors `Form.Root`'s logic (with
the same visible-submitter guard that ignores Conform's hidden
`__intent__` buttons), so invalid fields surface their messages on the
Next click.

## New — `AppNavigation` `itemClassName` + `activeItemClassName`

Two optional props on `AppNavigation` (and the underlying `NavMenu`)
let consumers override the visual treatment of nav-item buttons
without forking the component:

```tsx
<AppNavigation
  ...
  activeItemClassName="font-bold text-primary border-l-2 border-primary"
/>
```

`activeItemClassName` is appended only when the item is active, so the
override fires on the actual active leaf only.

## Convention — adapter-aware zod required-field schemas

The demo Form schemas in
`apps/storybook/stories/features/form/_shared.tsx` document a small
schema convention that surfaces the same custom message under both
adapters:

```ts
z.string({ error: 'Name is required' }).min(1, 'Name is required')
```

Conform's `parseWithZod` strips empty inputs to `undefined` (which
otherwise yields zod v4's default `"Invalid input"`); RHF's
`zodResolver` passes `""` through unchanged. The constructor-level
`error` catches the Conform path; `.min(1)` catches the RHF path.

## Chore — dependency bumps

Routine minor and patch bumps applied across the workspaces via
`ncu --target minor` (stays within the current major for every
package). Notable: `pnpm` 10.33.2 → 10.33.4, `turbo` 2.9.6 → 2.9.12,
`tailwindcss` 4.2.4 → 4.3.0, `next` 16.2.4 → 16.2.6, `react-hook-form`
7.74.0 → 7.75.0, the `@tiptap/*` family 3.22.5 → 3.23.1, `tsdown`
0.21.10 → 0.22.0 (pre-1.0 minor — verified the build still passes),
and `zod` 4.4.1 → 4.4.3.

Major upgrades intentionally deferred (need individual investigation):
`pnpm` 10 → 11, `react-day-picker` 9 → 10, `fumadocs-mdx` 14 → 15,
`@eslint-react/eslint-plugin` 3 → 5.
