---
"@datum-cloud/datum-ui-native": patch
---

Give `Button` a default `hitSlop` that grows its touch area to 44pt, vertically for every size and on both axes for icon-only buttons, without changing how it looks; pass `hitSlop` to override it or `null` to turn it off.
