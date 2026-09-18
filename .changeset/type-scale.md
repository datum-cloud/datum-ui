---
"@datum-cloud/datum-ui": major
---

One type scale, `4xs` through `8xl`, now backs both the raw `text-*` utilities and the Typography components, so `text-sm` and `<Text size="sm">` always render the same size. The scale is defined in the alpha theme; Storybook "Docs/Type Scale" has the rules and the full table.

- New steps below `xs`: `text-4xs` (10px), `text-3xs` (11px), `text-2xs` (12px). `text-1xs` is removed. `text-2xs` changes from 9px to 12px.
- `xs` through `lg` keep their sizes on every screen. `xl` and larger shrink on tablet (< 1024px) and mobile (< 768px), always to another step in the scale. The desktop values are unchanged.
- `Text` and `Paragraph` accept every step. `size="base"` is now a real 16px (it used to render 14px, the same as `sm`), and the default size is `sm`, so text with no `size` still renders 14px.
- `Title` levels map to one step each (`1` → `4xl` … `6` → `base`) instead of per-level `md:` / `lg:` classes. Desktop sizes are unchanged; tablet and mobile sizes follow the scale.
- Components that used hard-coded `text-[10px]` / `text-[11px]` now use `text-4xs` / `text-3xs` (same size). The task-queue badge count moves from 9px to 10px, and the calendar weekday labels from 12.8px to 13px.

- `Text` and `Title` inherit their parent's color when `textColor` is unset, instead of forcing `text-foreground`. Top-level text is unchanged because `body` sets the foreground color; text inside a colored parent (alert, badge, muted container) now follows it. `textColor="default"` still forces foreground.
- New theme tokens `--success`, `--warning` and `--info` give `text-success`, `text-warning` and `text-info` utilities. `textColor` `success` / `warning` / `info` use them instead of raw green / yellow / blue palette classes. Values match the old palette colors, so nothing changes visually.

Migrating: rename `text-2xs` → `text-4xs` first, then `text-1xs` → `text-2xs`, then change `size="base"` to `size="sm"` on `Text` / `Paragraph` (or drop the prop). Check `Text` / `Title` without a `textColor` that sit inside a colored parent; add `textColor="default"` only where the old forced foreground was intended.
