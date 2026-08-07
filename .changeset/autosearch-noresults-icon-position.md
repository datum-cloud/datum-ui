---
"@datum-cloud/datum-ui": patch
---

fix(autosearch): keep the no-results indicator icon inside the input

The no-results `AlertCircle` was rendered as the `Tooltip`'s direct child. `Tooltip` wraps its children in a `relative inline-flex` span, which (a) is static/in-flow — so the icon dropped below the full-width input — and (b) re-anchored the icon's `absolute` positioning to that ~0-size wrapper. The result was an icon rendering below-left of the input and getting clipped inside dialogs.

The `absolute` positioning now lives on a bare span that is a direct child of the input's `relative` container (matching the loading spinner), with `Tooltip` wrapping only the icon. The indicator sits at the input's right edge again, with the message on hover.
