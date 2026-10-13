# @datum-cloud/datum-ui-native

## 0.1.0

### Minor Changes

- ff0fe8c: Add `@datum-cloud/datum-ui-assistant-core`, the platform-free core of the assistant ("Patch"): the shared types, `DEFAULT_ASSISTANT_CONFIG` data, the message and tool derivations, an event → `UIMessage` reducer, transcript mapping, an SSE parser over any `ReadableStream`, an A2A stream adapter, and a chat transport (`sendStreaming` / `cancel` / `getTask` / `rename` plus the history helpers) with `fetch`, base URL and token injected. `@datum-cloud/datum-ui-native` gains the assistant components built on it (thread, messages with markdown, composer, suggestions, empty state, thinking block, loading dots, conversation rows). The web assistant in `@datum-cloud/datum-ui` now takes its helpers and types from the core, with no change in behaviour.
- d296271: Add React Native support. `@datum-cloud/datum-ui-tokens` publishes the datum-ui design tokens (palette, light/dark semantic colours, spacing, radius, type scale, fonts, motion) as plain TypeScript generated from the CSS, with a `check:tokens` drift check in CI. `@datum-cloud/datum-ui-native` adds React Native components that keep the web prop names and variant unions: Text, Title, Button, Badge, StatusBadge, Card, Alert, Skeleton, Spinner, Separator, Avatar, the Logo family and EmptyContent, plus `DatumThemeProvider` / `useDatumTheme` and the bundled Alliance No.1 and Canela Text fonts.

### Patch Changes

- Updated dependencies [ff0fe8c]
- Updated dependencies [d296271]
  - @datum-cloud/datum-ui-assistant-core@0.1.0
  - @datum-cloud/datum-ui-tokens@0.1.0
