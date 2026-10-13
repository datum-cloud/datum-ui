# @datum-cloud/datum-ui-assistant-core

The platform-free core of Datum's assistant ("Patch"), shared by the web assistant in [`@datum-cloud/datum-ui/assistant`](../datum-ui/src/components/features/assistant) and the React Native components in [`@datum-cloud/datum-ui-native`](../native/README.md). No React, DOM or React Native: `fetch`, the base URL and the token source are injected. Its only dependency is `ai` (a peer, for the `UIMessage` types).

## Install

```sh
pnpm add @datum-cloud/datum-ui-assistant-core ai
```

## What's in it

| Area                | Exports                                                                                                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Types               | `AssistantConfig<TNode>` (render props generic over the host's node type), `AssistantConfigData`, `ChatSummary`, `Turn`, `Mention`, `LinkRenderProps<TNode>`, model/effort types  |
| Config              | `DEFAULT_ASSISTANT_CONFIG` (data only; hosts add `renderLink`)                                                                                                                    |
| Message derivations | `messageText`, `firstText`, `hasText`, `activeToolPart`, `showInitialLoading`, `showToolIndicator`, `toolLabel`, part guards matching `ai@7`                                      |
| Formatting          | `formatRelativeTime`, `thinkingLabel`, `assistantErrorMessage`, `deriveTurns`, `deriveTitle`, `chatToMarkdown`, `chatFileName`, `repairStreamingMarkdown`                         |
| Streaming           | `AssistantStreamEvent` (`text_delta` / `text_replace` / `tool_start` / `tool_finish` / `done`), `applyAssistantEvent` (events → `UIMessage` parts), `turnOutcome`                 |
| SSE                 | `parseSSE` over any `ReadableStream<Uint8Array>` (skips `: ping` comments), `parseAssistantEventStream` for the flat `/chat/.../sendmessage` stream                               |
| A2A                 | `A2AStreamAdapter` (A2A v1.0 JSON-RPC frames → events), `buildSendParams`, wire types                                                                                             |
| Transport           | `createAssistantTransport({ baseUrl, fetch, getToken, refreshToken? })` → `sendStreaming`, `cancel`, `getTask`, `rename`                                                          |
| History             | `listConversations`, `getConversationMessages`, `setConversationArchived`, `deleteConversation`, `getAssistantEndpointUrl`, `toChatSummary`, `mergeChatSummaries`, `toUIMessages` |

The `ai` part guards are re-implemented (one line each) rather than imported: `ai` ships as one large module and Metro has no tree shaking, so importing them would pull the whole SDK into React Native bundles. A test pins them to `ai`'s own.

## Chatting

```ts
import { applyAssistantEvent, createAssistantTransport } from '@datum-cloud/datum-ui-assistant-core'

const transport = createAssistantTransport({
  baseUrl: 'https://patch.staging.env.datum.net', // or getAssistantEndpointUrl(scopedFetch)
  fetch, // must stream bodies: `expo/fetch` in React Native
  getToken: () => session.getAccessToken(),
  refreshToken: rejected => session.handleUnauthorized(rejected), // one retry on 401
})

for await (const event of transport.sendStreaming({ text, contextId, projectName, signal })) {
  messages = applyAssistantEvent(messages, event)
}
```

- `sendStreaming` calls `SendStreamingMessage` on `{baseUrl}/a2a` with the user's own token, so tools run as the user. `contextId` is a client-made UUID; the first send creates the conversation.
- A stream that ends without a terminal state is a dropped connection, not a finished turn: the transport polls `GetTask` (1 s, doubling to 8 s, up to 5 minutes) and yields the stored answer as a `text_replace`, then `done`.
- `cancel(taskId)` backs a Stop button. A task that already finished resolves `false`.
- HTTP failures (including 401/403) throw `AssistantHttpError` with the status in the message; JSON-RPC errors throw `A2ARpcError`.

History goes through the aggregated apiserver, not the service: pass a fetch that is already scoped to the project's control plane (`/apis/resourcemanager.miloapis.com/v1alpha1/projects/{project}/control-plane`). Don't send through the apiserver's `sendmessage` subresource; it has no caller token, so tools would run without the user's identity.

## Trying it against a deployment

```sh
pnpm build
TOKEN=$(datumctl auth get-token --output=token) \
  node scripts/live-chat.mjs --project <project> --delete "What resources do I have in this project?"
```

The script discovers the service from the project's `AssistantEndpoint`, prints text as it streams and tool calls as they start and finish, and with `--delete` removes the conversation afterwards. Use read-only prompts: Patch acts with your identity.

## Tests

`pnpm test` (vitest). `test/fixtures/a2a-stream.sse` is a real `SendStreamingMessage` stream captured from staging, with the answer text and project name replaced.
