'use client'

import type { Editor } from '@tiptap/react'
import type { UIMessage } from 'ai'
import type { MouseEvent as ReactMouseEvent, RefObject } from 'react'
import type { AssistantConfig, ChatSummary, EffortId } from '../types'
import { PanelLeft } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Tooltip } from '../../../base/tooltip'
import { AssistantConfigProvider } from '../context'
import { PromptCard } from './composer'
import { Conversation } from './conversation'
import { EmptyState } from './empty-state'
import { ChatRail, HistoryPanel } from './sidebar'

/**
 * Presentational, props-driven assistant layout: left rail + collapsible
 * history + (empty state | conversation) + composer. The host owns all state
 * and transport (via its own chat hook) and feeds it in here, so staff and
 * cloud reuse the exact same layout. Shell-agnostic — it fills its container.
 */
export interface AssistantWorkspaceProps {
  /** Host-specific configuration (copy, suggestions, tool labels, models, …). */
  config?: Partial<AssistantConfig>
  /** Display name for the greeting; the host reads it from its own user context. */
  userName?: string
  /** Header title for the active conversation. */
  title: string

  messages: UIMessage[]
  status: string
  error?: Error
  isReady: boolean

  chatList: ChatSummary[]
  currentChatId: string

  editor: Editor | null
  /** Sanitized HTML per user message index (for exact-render of the user's input). */
  htmlByUserMsgIndex: RefObject<string[]>
  bottomRef: RefObject<HTMLDivElement | null>
  containerRef: (node: HTMLDivElement | null) => void
  userScrolledUpRef: RefObject<boolean>

  onSend: () => void
  onStop: () => void
  onRetry: () => void
  onNewChat: () => void
  onLoadChat: (chat: ChatSummary) => void
  onDeleteChat: (e: ReactMouseEvent, chatId: string) => void
  onSuggestion: (text: string) => void

  modelId: string
  effortId: EffortId
  onModelChange: (id: string) => void
  onEffortChange: (id: EffortId) => void

  micSupported?: boolean
  micListening?: boolean
  micFrequencyData?: number[]
  onMicToggle?: () => void

  historyOpen: boolean
  onToggleHistory: () => void
}

export function AssistantWorkspace({
  config,
  userName,
  title,
  messages,
  status,
  error,
  isReady,
  chatList,
  currentChatId,
  editor,
  htmlByUserMsgIndex,
  bottomRef,
  containerRef,
  userScrolledUpRef,
  onSend,
  onStop,
  onRetry,
  onNewChat,
  onLoadChat,
  onDeleteChat,
  onSuggestion,
  modelId,
  effortId,
  onModelChange,
  onEffortChange,
  micSupported,
  micListening,
  micFrequencyData,
  onMicToggle,
  historyOpen,
  onToggleHistory,
}: AssistantWorkspaceProps) {
  const hasMessages = messages.length > 0

  const promptCard = (
    <PromptCard
      editor={editor}
      isReady={isReady}
      canRetry={status === 'error'}
      onSend={onSend}
      onStop={onStop}
      onRetry={onRetry}
      modelId={modelId}
      effortId={effortId}
      onModelChange={onModelChange}
      onEffortChange={onEffortChange}
      speechSupported={micSupported}
      isListening={micListening}
      frequencyData={micFrequencyData}
      onMicToggle={onMicToggle}
    />
  )

  return (
    <AssistantConfigProvider config={config}>
      <div className="bg-background flex h-full w-full overflow-hidden">
        <ChatRail historyOpen={historyOpen} onNewChat={onNewChat} onToggleHistory={onToggleHistory} />

        <AnimatePresence initial={false}>
          {historyOpen && (
            <motion.div
              className="h-full shrink-0 overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: 256 }}
              exit={{ width: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            >
              <HistoryPanel
                chatList={chatList}
                currentChatId={currentChatId}
                onLoadChat={onLoadChat}
                onDeleteChat={onDeleteChat}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          {hasMessages
            ? (
                <>
                  <header className="flex h-12 shrink-0 items-center justify-between border-b px-4">
                    <span className="text-foreground min-w-0 truncate text-sm font-medium">{title}</span>
                    <div className="flex items-center gap-1">
                      <Tooltip message={historyOpen ? 'Close sidebar' : 'Open sidebar'} side="bottom">
                        <button
                          type="button"
                          aria-label="Toggle sidebar"
                          onClick={onToggleHistory}
                          className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md p-1.5 transition-colors"
                        >
                          <PanelLeft className="size-4" />
                        </button>
                      </Tooltip>
                    </div>
                  </header>

                  <Conversation
                    messages={messages}
                    status={status}
                    error={error}
                    htmlByUserMsgIndex={htmlByUserMsgIndex}
                    containerRef={containerRef}
                    bottomRef={bottomRef}
                    userScrolledUpRef={userScrolledUpRef}
                    footer={promptCard}
                  />
                </>
              )
            : (
                <EmptyState name={userName} isReady={isReady} onSuggestion={onSuggestion}>
                  {promptCard}
                </EmptyState>
              )}
        </div>
      </div>
    </AssistantConfigProvider>
  )
}
