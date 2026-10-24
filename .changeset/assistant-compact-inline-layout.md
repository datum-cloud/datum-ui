---
"@datum-cloud/datum-ui": minor
---

Rework the assistant's `density="compact"` to match the inline Patch mock on the project home page. The conversation now fills the host's width with 1.75rem side padding instead of a centered 42rem column, body text is back at `text-sm` with relaxed line height, the avatar is a filled brand circle, user bubbles use `bg-muted` with even corners, inline code is plain mono text that wraps anywhere, and the copy and download actions are left out (a host's own `messageActions` still render). `PromptCard` takes a new `density` prop: `compact` is a one-row field with an outline send button. The default density renders exactly as before.

Add `AssistantChoiceChips`, a pick-one question drawn as a row of buttons. `AssistantMessage` renders a `data-choices` part (`CHOICES_PART_TYPE`, with `AssistantChoicesData`) with it, and `Conversation` and `AssistantWorkspace` take an `onChoose(messageId, option)` callback. Only the latest turn's question can be answered, and only once it has finished streaming. A picked option stays marked with a check and the others fade.
