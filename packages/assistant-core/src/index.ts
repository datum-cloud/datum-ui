// Platform-free core of the Datum assistant ("Patch"): shared by the web
// assistant in @datum-cloud/datum-ui and the React Native components in
// @datum-cloud/datum-ui-native. No React, no DOM, no React Native: `fetch`,
// the base URL and the token source are injected.

export {
  A2A_ERROR,
  A2ARpcError,
  A2AStreamAdapter,
  buildSendParams,
  isToolActivityData,
  partsText,
  RESPONSE_ARTIFACT_ID,
  taskResponseText,
  terminalState,
} from './a2a'
export type {
  A2AArtifact,
  A2AArtifactUpdate,
  A2AMessage,
  A2APart,
  A2AStatusUpdate,
  A2AStreamResult,
  A2AStreamState,
  A2ATask,
  A2ATaskState,
  A2ATaskStatus,
  JsonRpcError,
  JsonRpcResponse,
  ToolActivityData,
} from './a2a'
export { isAssistantStreamEvent } from './events'
export type {
  AssistantStreamEvent,
  DoneEvent,
  TextDeltaEvent,
  TextReplaceEvent,
  ToolFinishEvent,
  ToolStartEvent,
  TurnState,
} from './events'
export {
  assistantErrorMessage,
  chatFileName,
  chatToMarkdown,
  DEFAULT_ASSISTANT_CONFIG,
  deriveTitle,
  deriveTurns,
  formatRelativeTime,
  NEW_CHAT_TITLE,
  thinkingLabel,
} from './format'
export {
  ASSISTANT_ENDPOINT_NAME,
  conversationPath,
  conversationsPath,
  deleteConversation,
  getAssistantEndpointUrl,
  getConversationMessages,
  listConversations,
  mergeChatSummaries,
  setConversationArchived,
  SUMMARY_HEADING,
  toChatSummary,
  toUIMessages,
} from './history'
export type { AssistantEndpoint, Conversation, ScopedFetch, StoredMessage } from './history'
export { repairStreamingMarkdown } from './markdown'
export {
  activeToolPart,
  DEFAULT_TOOL_LABEL,
  firstText,
  getToolName,
  hasText,
  isDynamicToolUIPart,
  isReasoningUIPart,
  isStreamingMessage,
  isTextUIPart,
  isToolUIPart,
  messageText,
  showInitialLoading,
  showToolIndicator,
  toolLabel,
} from './parts'
export type { MessageActivityInput } from './parts'
export { applyAssistantEvent, applyEventToParts, turnOutcome } from './reducer'
export type { ApplyEventOptions } from './reducer'
export { parseAssistantEventStream, parseSSE, parseSSEBlock, parseSSEJson } from './sse'
export type { ParseSSEOptions, SSEMessage } from './sse'
export {
  AssistantHttpError,
  createAssistantTransport,
  httpError,
  isAbortError,
  MAX_CONVERSATION_NAME_LENGTH,
  randomId,
  TurnInterruptedError,
} from './transport'
export type {
  AssistantTransport,
  AssistantTransportOptions,
  FetchInit,
  FetchLike,
  FetchResponse,
  RenameInput,
  SendStreamingInput,
} from './transport'
export type {
  AssistantConfig,
  AssistantConfigData,
  ChatSummary,
  DynamicToolUIPart,
  EffortId,
  EffortOption,
  LinkRenderProps,
  Mention,
  ModelOption,
  ModelSelectorConfig,
  TextUIPart,
  ToolUIPart,
  Turn,
  UIMessage,
  UIMessagePart,
} from './types'
