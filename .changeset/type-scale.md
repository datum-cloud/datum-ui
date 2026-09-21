---
"@datum-cloud/datum-ui": major
---

One type scale, `5xs` through `8xl`, now backs both the raw `text-*` utilities and the Typography components, so `text-sm` and `<Text size="sm">` always render the same size. The scale is defined in the alpha theme; Storybook "Docs/Type Scale" has the rules and the full table.

- New steps below `xs`: `text-5xs` (9px), `text-4xs` (10px), `text-3xs` (11px), `text-2xs` (12px). `text-1xs` is removed, and `text-2xs` changes meaning from 9px to 12px — the old 9px size is now `text-5xs`.
- `xs` through `lg` keep their sizes on every screen. `xl` and larger shrink on tablet (< 1024px) and mobile (< 768px), always to another step in the scale. The desktop values are unchanged.
- `Text` and `Paragraph` accept every step. `size="base"` is now a real 16px (it used to render 14px, the same as `sm`), and the default size is `sm`, so text with no `size` still renders 14px.
- `Title` levels map to one step each (`1` → `4xl` … `6` → `base`) instead of per-level `md:` / `lg:` classes. Desktop sizes are unchanged; tablet and mobile sizes follow the scale.
- Components that used hard-coded `text-[10px]` / `text-[11px]` now use `text-4xs` / `text-3xs` (same size). The calendar weekday labels move from 12.8px to 13px; every other component keeps its rendered size.

- `Text` and `Title` inherit their parent's color when `textColor` is unset, instead of forcing `text-foreground`. Top-level text is unchanged because `body` sets the foreground color; text inside a colored parent (alert, badge, muted container) now follows it. `textColor="default"` still forces foreground.
- New theme tokens `--success`, `--warning` and `--info` give `text-success`, `text-warning` and `text-info` utilities. `textColor` `success` / `warning` / `info` use them instead of raw green / yellow / blue palette classes. Values match the old palette colors, so nothing changes visually.

- `Text` no longer applies `leading-relaxed`. Each step carries its own line height, so `<Text size="sm">` and `text-sm` now render identically; pass a `leading-*` class for a different rhythm. `Paragraph` keeps its `spacing` prop, whose `normal` default is still `leading-relaxed`.

Migrating: rename `text-2xs` → `text-5xs` first, then `text-1xs` → `text-2xs`, then change `size="base"` to `size="sm"` on `Text` / `Paragraph` (or drop the prop). Check `Text` / `Title` without a `textColor` that sit inside a colored parent; add `textColor="default"` only where the old forced foreground was intended.
