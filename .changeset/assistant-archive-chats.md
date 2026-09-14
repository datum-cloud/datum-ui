---
"@datum-cloud/datum-ui": minor
---

Assistant chat history can archive chats and confirm deletes. All new props are optional; hosts that pass none of them see no change.

- `ChatSummary` gains `archived?: boolean`.
- `AssistantWorkspace` and `HistoryPanel` accept `onArchiveChat`, `onUnarchiveChat`, and `confirmDelete`.
- When `onArchiveChat` is passed, the history panel lists active chats by default and adds an "Archived" toggle next to the search input that switches to archived chats. Search applies within the current view, and each view has its own empty state. Active rows gain an archive action. Archived rows gain an unarchive action (`onUnarchiveChat`) and keep delete. Without `onArchiveChat`, the `archived` flag is ignored and no archive UI renders.
- `confirmDelete` opens a dialog warning that the delete can't be undone, and calls `onDeleteChat` only after the user confirms.
- `HistoryPanelProps` is now exported.
