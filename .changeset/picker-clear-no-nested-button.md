---
'@datum-cloud/datum-ui': patch
---

Picker triggers no longer nest a `<button>` for the clear X. The browser closed the trigger early on server-rendered pages, so the X showed below the field until hydration. The X is now a focusable `role="button"` element that Enter and Space activate.
