---
"@datum-cloud/datum-ui": patch
---

Fix SettingsNavItem `asChild` so a router Link can own the element, and size SettingsNav items at `text-xs` (13px) to match the app nav. `cva` stays private; the danger icon reads `data-variant`. CardSaveBar's live region wraps only the status text so Cancel/Save are not re-announced.
