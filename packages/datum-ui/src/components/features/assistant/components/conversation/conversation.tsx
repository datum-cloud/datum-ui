'use client'

import type { UIMessage } from 'ai'
import type { RefObject } from 'react'
import type { ConversationDensity } from '../../types'
import { assistantErrorMessage, isTextUIPart } from '@datum-cloud/datum-ui-assistant-core'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { cn } from '../../../../../utils/cn'
import { useTurnRail } from '../../hooks'
import { sanitizeUserHtml } from '../../utils'
import { AssistantMessage, LoadingDots, UserMessage } from '../message'
import { ScrollToBottomButton } from './scroll-to-bottom-button'
import { TurnRail } from './turn-rail'

interface ConversationProps {
  messages: UIMessage[]
  status: string
  error?: Error
  htmlByUserMsgIndex: RefObject<string[]>
  containerRef: (node: HTMLDivElement | null) => void
  bottomRef: RefObject<HTMLDivElement | null>
  userScrolledUpRef: RefObject<boolean>
  /** The docked prompt card, pinned to the bottom. */
  footer: React.ReactNode
  /**
   * `default` is the full workspace layout. `compact` is for a conversation
   * embedded in another page: an avatar beside each assistant turn, a
   * narrower column (42rem, footer included), one-step-smaller body text and
   * tighter markdown spacing.
   */
  density?: ConversationDensity
}

export function Conversation({
  messages,
  status,
  error,
  htmlByUserMsgIndex,
  containerRef,
  bottomRef,
  userScrolledUpRef,
  footer,
  density = 'default',
}: ConversationProps) {
  const compact = density === 'compact'
  const [showScrollButton, setShowScrollButton] = useState(false)
  const { turns, activeTurnId, setScrollEl, handleScroll, scrollToTurn } = useTurnRail(
    messages,
    containerRef,
    userScrolledUpRef,
  )
  let userMsgIdx = 0

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={setScrollEl}
        onScroll={e => setShowScrollButton(handleScroll(e.currentTarget))}
        className="flex-1 overflow-y-auto scroll-smooth"
      >
        <div
          className={
            compact
              ? 'mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-4'
              : 'mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6'
          }
        >
          {messages.map((msg, msgIdx) => {
            const isLastMessage = msgIdx === messages.length - 1

            if (msg.role === 'user') {
              const html = htmlByUserMsgIndex.current[userMsgIdx++]
              const fallbackText = msg.parts.find(isTextUIPart)?.text ?? ''
              return (
                <motion.div
                  key={msg.id}
                  data-turn-id={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <UserMessage html={html ?? sanitizeUserHtml(fallbackText)} density={density} />
                </motion.div>
              )
            }

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <AssistantMessage
                  msg={msg}
                  isLastMessage={isLastMessage}
                  status={status}
                  density={density}
                />
              </motion.div>
            )
          })}

          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                // Compact indents past the avatar to sit in the text column.
                className={cn(
                  'text-destructive bg-destructive/10 w-fit rounded-lg px-3 py-2',
                  compact ? 'ml-9 text-xs' : 'text-sm',
                )}
              >
                {assistantErrorMessage(error)}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {status === 'submitted' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={cn('flex justify-start', compact && 'pl-9')}
              >
                <LoadingDots />
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      <TurnRail turns={turns} activeId={activeTurnId} onJump={scrollToTurn} />

      <div className="relative shrink-0 px-4 pb-4">
        <ScrollToBottomButton
          show={showScrollButton && messages.length > 0}
          onClick={() => {
            userScrolledUpRef.current = false
            setShowScrollButton(false)
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
        {/* Same width as the transcript column, so the two line up. */}
        <div className={compact ? 'mx-auto w-full max-w-2xl' : 'mx-auto w-full max-w-3xl'}>
          {footer}
        </div>
      </div>
    </div>
  )
}
