'use client'

import type { Editor } from '@tiptap/react'
import type { UIMessage } from 'ai'
import type { MouseEvent as ReactMouseEvent, ReactNode, RefObject } from 'react'
import type { AssistantConfig, ChatSummary, EffortId } from '../types'
import { PanelLeft, SquarePen, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Tooltip } from '../../../base/tooltip'
import { Icon } from '../../../icons/icon-wrapper'
import { AssistantConfigProvider } from '../context'
import { PromptCard } from './composer'
import { Conversation } from './conversation'
import { EmptyState } from './empty-state'
import { ChatRail, HistoryPanel } from './sidebar'

export type AssistantWorkspaceOrientation = 'horizontal' | 'vertical'

/**
 * Presentational, props-driven assistant layout: left rail + collapsible
 * history + (empty state | conversation) + composer. The host owns all state
 * and transport (via its own chat hook) and feeds it in here, so staff and
 * cloud reuse the exact same layout. Shell-agnostic — it fills its container.
 *
 * `orientation="vertical"` suits a tall, narrow container such as a docked side
 * panel: the rail folds into a top bar and history opens as a drawer over the
 * content instead of narrowing it.
 */
export interface AssistantWorkspaceProps {
  /**
   * `horizontal` (default) puts the rail and history beside the content, for a
   * wide container. `vertical` swaps them for a top bar and a history drawer,
   * for a tall, narrow one such as a side dock.
   */
  orientation?: AssistantWorkspaceOrientation
  /**
   * Renders a close button at the end of the header. Hosts that show the
   * workspace in a dismissible panel pass this instead of overlaying their own
   * button, which would collide with the header's controls.
   */
  onClose?: () => void
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
  /**
   * Optional block pinned above the history search input, naming the scope the
   * listed chats belong to (cloud-portal shows the current project).
   */
  sidebarHeader?: ReactNode

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
  /**
   * Opt-in archive support. When provided, `chatList` may mix archived and
   * active chats; the history panel lists active chats by default and adds an
   * "Archived" view toggle plus per-row archive actions.
   */
  onArchiveChat?: (e: ReactMouseEvent, chatId: string) => void
  /** Restores an archived chat from the history panel's archived view. */
  onUnarchiveChat?: (e: ReactMouseEvent, chatId: string) => void
  /** Confirm (deletion can't be undone) before calling `onDeleteChat`. */
  confirmDelete?: boolean
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

const HEADER_BUTTON_CLASS
  = 'text-muted-foreground hover:text-foreground hover:bg-accent shrink-0 rounded-md p-1.5 transition-colors'

const PANEL_SPRING = { type: 'spring', stiffness: 400, damping: 32 } as const

export function AssistantWorkspace({
  orientation = 'horizontal',
  onClose,
  config,
  userName,
  title,
  messages,
  status,
  error,
  isReady,
  chatList,
  currentChatId,
  sidebarHeader,
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
  onArchiveChat,
  onUnarchiveChat,
  confirmDelete,
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
  const isVertical = orientation === 'vertical'

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

  const historyPanel = (
    <HistoryPanel
      chatList={chatList}
      currentChatId={currentChatId}
      header={sidebarHeader}
      // The vertical drawer covers the chat, so get it out of the way once one is picked.
      onLoadChat={(chat) => {
        onLoadChat(chat)
        if (isVertical)
          onToggleHistory()
      }}
      onDeleteChat={onDeleteChat}
      onArchiveChat={onArchiveChat}
      onUnarchiveChat={onUnarchiveChat}
      confirmDelete={confirmDelete}
    />
  )

  const historyToggle = (
    <Tooltip message={historyOpen ? 'Close sidebar' : 'Open sidebar'} side="bottom">
      <button
        type="button"
        aria-label="Toggle sidebar"
        aria-expanded={historyOpen}
        onClick={onToggleHistory}
        className={HEADER_BUTTON_CLASS}
      >
        <Icon icon={PanelLeft} className="size-4" />
      </button>
    </Tooltip>
  )

  const closeButton = onClose && (
    <Tooltip message="Close" side="bottom">
      <button type="button" aria-label="Close" onClick={onClose} className={HEADER_BUTTON_CLASS}>
        <Icon icon={X} className="size-4" />
      </button>
    </Tooltip>
  )

  const content = hasMessages
    ? (
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
      )
    : (
        <EmptyState name={userName} isReady={isReady} onSuggestion={onSuggestion} compact={isVertical}>
          {promptCard}
        </EmptyState>
      )

  if (isVertical) {
    return (
      <AssistantConfigProvider config={config}>
        <div className="bg-background flex h-full w-full flex-col overflow-hidden">
          <header className="flex h-12 shrink-0 items-center gap-1 border-b px-2">
            {historyToggle}
            <span className="text-foreground min-w-0 flex-1 truncate px-1 text-sm font-medium">{title}</span>
            <Tooltip message="New chat" side="bottom">
              <button
                type="button"
                aria-label="New chat"
                onClick={() => {
                  onNewChat()
                  if (historyOpen)
                    onToggleHistory()
                }}
                className={HEADER_BUTTON_CLASS}
              >
                <Icon icon={SquarePen} className="size-4" />
              </button>
            </Tooltip>
            {closeButton}
          </header>

          <div className="relative flex min-h-0 flex-1 flex-col">
            {content}

            <AnimatePresence initial={false}>
              {historyOpen && (
                <motion.div
                  key="history-scrim"
                  aria-hidden
                  className="bg-foreground/10 absolute inset-0 z-30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={onToggleHistory}
                />
              )}
              {historyOpen && (
                // Same width reveal as the horizontal panel: a slide would let the
                // spring's overshoot pull the drawer away from the left edge.
                <motion.div
                  key="history-drawer"
                  className="absolute inset-y-0 left-0 z-40 max-w-[85%] overflow-hidden shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: 256 }}
                  exit={{ width: 0 }}
                  transition={PANEL_SPRING}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape')
                      onToggleHistory()
                  }}
                >
                  {historyPanel}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </AssistantConfigProvider>
    )
  }

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
              transition={PANEL_SPRING}
            >
              {historyPanel}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex min-w-0 flex-1 flex-col">
          {hasMessages
            ? (
                <header className="flex h-12 shrink-0 items-center justify-between border-b px-4">
                  <span className="text-foreground min-w-0 truncate text-sm font-medium">{title}</span>
                  <div className="flex items-center gap-1">
                    {historyToggle}
                    {closeButton}
                  </div>
                </header>
              )
            // No header on the empty state, so the close button floats in its corner.
            : closeButton && <div className="absolute top-2 right-2 z-10">{closeButton}</div>}

          {content}
        </div>
      </div>
    </AssistantConfigProvider>
  )
}
