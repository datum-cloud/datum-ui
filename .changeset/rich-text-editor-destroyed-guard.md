---
"@datum-cloud/datum-ui": patch
---

Stop `RichTextEditor` throwing when `disabled`, `content` or `placeholder` change after its Tiptap editor was destroyed, which crashed under React StrictMode effect re-runs.
