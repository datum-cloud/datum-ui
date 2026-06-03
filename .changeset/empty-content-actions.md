---
"@datum-cloud/datum-ui": major
---

`EmptyContent` actions now use an `as`-discriminated union that forwards the full `Button`
(and anchor) prop surface, plus RBAC-friendly `hidden` and `tooltip` props.

Migration:

- `type` (action kind) → `as` (`'button' | 'link' | 'external-link'`).
- `variant: 'default' | 'destructive' | 'outline'` → Button's `type` + `theme`
  (e.g. `destructive` → `type: 'danger'`; `outline` → `theme: 'outline'`).
- `iconPosition: 'start' | 'end'` → `'left' | 'right'`.
- New per-action props: `disabled`, `hidden`, `tooltip`, `tooltipSide`, and any other
  `Button` prop (`loading`, `theme`, `block`, …).
- Disabled `link`/`external-link` actions now render as a plain disabled button (no anchor).
