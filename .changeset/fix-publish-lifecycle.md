---
"@datum-cloud/datum-ui": patch
---

Fix npm publish lifecycle: restore workspace deps in postpublish instead of postpack so the stripped package.json is used during upload
