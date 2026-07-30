---
'@datum-cloud/datum-ui': patch
---

Fix `ModelSelector` overflowing the viewport when many models are listed. Cap the menu height to available space, scroll only the model list, and keep the Effort section pinned at the bottom.
