---
"@datum-cloud/datum-ui": minor
---

Add `orientation` and `onClose` to `AssistantWorkspace`. `orientation="vertical"` suits a tall, narrow container such as a side dock: the left rail folds into a top bar (history toggle, title, new chat), history opens as a drawer over the content instead of narrowing it, and the empty state tightens up. `horizontal` stays the default. `onClose` renders a close button inside the workspace's own header, so a host panel no longer has to overlay one on top of the header's controls.

Every assistant icon now renders through `Icon`, so they share the library's 1px stroke instead of lucide's heavier default.
