---
"@datum-cloud/datum-ui": patch
---

Make `Autosearch` call the latest `onSearch` and `onValueChange` props when a pending debounce fires or a single result auto-selects, instead of the handlers from an earlier render.
