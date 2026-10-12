# @datum-cloud/datum-ui-tokens

Datum design tokens as plain TypeScript: colours, spacing, radius, type scale, fonts and motion. No React or DOM dependency, so it works in React Native, charts, canvas, emails, anything.

The CSS in `@datum-cloud/datum-ui` is the source of truth. `src/tokens.gen.ts` is generated from it and checked in CI.

## Install

```sh
pnpm add @datum-cloud/datum-ui-tokens
```

## Usage

```ts
import { colors, motion, radius, spacing, tokens, typography, withAlpha } from '@datum-cloud/datum-ui-tokens'

colors.dark.background // '#0c1d31'
colors.light.btnPrimary // 'rgba(156, 121, 121, 0.9)'
spacing[4] // 16  (Tailwind step: p-4)
radius.md // 6
typography.sizes.sm // { fontSize: 14, lineHeight: 20 }
withAlpha(colors.light.primary, 0.2) // 'rgba(156, 121, 121, 0.2)'
```

All lengths are unitless px. Colours are `#rrggbb`, or `rgba(r, g, b, a)` when translucent.

## Exports

| Export                                           | What it holds                                                                                                                                                                                                             | Source                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `palette`                                        | Raw Figma colours (`midnightFjord`, `auroraMoss`, `canyonClay`, `glacierMist700`, …)                                                                                                                                      | `figma-tokens.css` `@theme`   |
| `colors.light` / `colors.dark`                   | Semantic roles, camelCased from the CSS custom properties: `background`, `foreground`, `card`, `primary`, `muted`, `border`, `destructive`, `success`, `btn*`, `badge*`, `card*`, `icon*`, `input*`, `chart1`–`chart5`, … | `alpha.css` `:root` / `.dark` |
| `spacing`                                        | Spacing scale keyed by Tailwind step (`spacing[4]` = 16, `spacing.px` = 1)                                                                                                                                                | `figma-tokens.css`            |
| `radius`                                         | Figma radii: `none` 0, `sm` 3, `md` 6, `lg` 9                                                                                                                                                                             | `figma-tokens.css`            |
| `radiusScale`                                    | `rounded-*` as datum-ui renders it: `sm` 2, `md` 4, `lg` 6, `xl` 10, `full`                                                                                                                                               | `shadcn.css` + `--radius`     |
| `typography.sizes`                               | Type scale `5xs`–`8xl` as `{ fontSize, lineHeight }`, at phone width (< 48rem)                                                                                                                                            | `alpha.css` type scale        |
| `typography.sizesByBreakpoint`                   | The same scale for `desktop`, `tablet` and `mobile`                                                                                                                                                                       | `alpha.css`                   |
| `typography.letterSpacing`, `typography.weights` | Figma letter spacing (px) and font weights                                                                                                                                                                                | `figma-tokens.css`            |
| `fonts`                                          | `{ sans: { regular, medium, semibold }, title, mono }` family names                                                                                                                                                       | —                             |
| `fontFiles`, `fontPostScriptNames`               | File and PostScript name for each family (iOS registers the PostScript name)                                                                                                                                              | font files                    |
| `motion`                                         | `easing` (cubic-bezier tuples: `out`, `inOut`, `drawer`) and `duration` in ms (`fast` 150, `medium` 250, `drawerIn` 350, `drawerOut` 200)                                                                                 | `motion.css`                  |
| `tokens`                                         | All of the above in one object                                                                                                                                                                                            | —                             |
| `withAlpha(color, alpha)`, `parseRgba(color)`    | Opacity helper (the `bg-x/20` equivalent)                                                                                                                                                                                 | —                             |
| Types                                            | `SemanticColors`, `ColorScheme`, `TypeSize`, `Palette`, `Spacing`, `Radius`, `Typography`, `Motion`, …                                                                                                                    | —                             |

## Regenerating

```sh
pnpm --filter @datum-cloud/datum-ui-tokens gen:tokens    # rewrite src/tokens.gen.ts
pnpm --filter @datum-cloud/datum-ui-tokens check:tokens  # exit 1 if it is stale (runs in CI)
```

The generator (`scripts/gen-tokens.mjs`) reads the CSS, resolves `var()` chains per scheme, and converts `oklch()`, `hsl()` and `color-mix()` to sRGB with `culori`. Colour roles that only one scheme defines are skipped with a warning.
