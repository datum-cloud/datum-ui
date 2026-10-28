---
"@datum-cloud/datum-ui": patch
---

`AssistantPlanCard` keeps its own clock, so a waiting plan turns expired at its `expiresAt` even while nothing else redraws the conversation; before, an idle card kept Approve enabled after its plan ran out. A `data-plan` part with no `id` now shows as itself with Approve disabled, instead of reading as replaced once another plan exists.
