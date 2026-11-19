---
"@datum-cloud/datum-ui-assistant-core": minor
"@datum-cloud/datum-ui": minor
"@datum-cloud/datum-ui-native": minor
---

Assistant replies load images only from origins listed in the new `imageOrigins` config option; other images show as a link or as text. On native, SVG images always show as a link, since an SVG can load images from other origins. Links written `//host` or `/\host` now open as external links, and `UserMessage` sanitizes its `html` itself. Hosts that want images in replies must list their origins.
