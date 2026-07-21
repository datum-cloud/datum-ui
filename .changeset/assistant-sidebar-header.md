---
'@datum-cloud/datum-ui': minor
---

Add two optional host slots to `AssistantWorkspace`, both prep for migrating cloud-portal onto the shared assistant:

- `sidebarHeader` — forwarded to the history panel and rendered above the search input, so a host can name the scope its saved chats belong to (cloud-portal shows the current project).
- `renderToolOutput` (on `AssistantConfig`) — renders a completed tool call inline, in message order. Tool calls are invisible by default; a host opts a specific tool into rendering UI from its output (cloud-portal turns an `openSupportTicket` result into a button).

Both are purely additive — hosts that omit them render exactly as before, so staff-portal needs no change.
