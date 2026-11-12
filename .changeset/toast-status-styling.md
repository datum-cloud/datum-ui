---
"@datum-cloud/datum-ui": patch
"@datum-cloud/datum-ui-tokens": patch
---

Warning and info toasts now have their own muted colours (new `toast-warning-*` and `toast-info-*` tokens) instead of reusing the error and success ones, and every status toast shows a labelled status icon. `toast.message` keeps its current look. The toast root now lays out as a flex row and carries a `data-variant` attribute.
