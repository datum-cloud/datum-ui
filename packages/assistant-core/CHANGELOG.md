# @datum-cloud/datum-ui-assistant-core

## 0.1.0

### Minor Changes

- ff0fe8c: Add `@datum-cloud/datum-ui-assistant-core`, the platform-free core of the assistant ("Patch"): the shared types, `DEFAULT_ASSISTANT_CONFIG` data, the message and tool derivations, an event → `UIMessage` reducer, transcript mapping, an SSE parser over any `ReadableStream`, an A2A stream adapter, and a chat transport (`sendStreaming` / `cancel` / `getTask` / `rename` plus the history helpers) with `fetch`, base URL and token injected. `@datum-cloud/datum-ui-native` gains the assistant components built on it (thread, messages with markdown, composer, suggestions, empty state, thinking block, loading dots, conversation rows). The web assistant in `@datum-cloud/datum-ui` now takes its helpers and types from the core, with no change in behaviour.
