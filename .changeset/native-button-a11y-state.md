---
"@datum-cloud/datum-ui-native": patch
---

Keep `Button` announcing its disabled and busy state when a caller passes its own `accessibilityState`, by merging the two instead of letting the caller's value replace them.
