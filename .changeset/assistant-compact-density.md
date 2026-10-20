---
"@datum-cloud/datum-ui": minor
---

Add an opt-in `density="compact"` to the assistant's `Conversation` (also accepted by `AssistantMessage` and `UserMessage`) for a conversation embedded in another page: the assistant avatar sits beside each assistant turn, user turns stay right-aligned bubbles, the column narrows to 42rem (composer included), body text drops one step, and markdown spacing tightens with headings at body size. Exports a `ConversationDensity` type. The default density renders exactly as before.
