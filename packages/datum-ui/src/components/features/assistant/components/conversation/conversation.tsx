'use client'

import type { UIMessage } from 'ai'
import type { RefObject } from 'react'
import type { AssistantChoiceOption, ConversationDensity } from '../../types'
import { assistantErrorMessage, isTextUIPart } from '@datum-cloud/datum-ui-assistant-core'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { cn } from '../../../../../utils/cn'
import { useTurnRail } from '../../hooks'
import { PLAN_PART_TYPE } from '../../types'
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
   * embedded in another page: it fills the host's width with 1.75rem side
   * padding, puts an avatar beside each assistant turn and tightens markdown
   * spacing.
   */
  density?: ConversationDensity
  /**
   * Called when the person picks an option of a question the assistant asked
   * as buttons, with the message it belongs to. Only the latest turn's
   * question can be answered, and only once it has finished streaming.
   */
  onChoose?: (messageId: string, option: AssistantChoiceOption) => void
  /**
   * Called when the person approves a plan card, with the message it is in
   * and the plan's id. Only the newest plan can be approved, and only while
   * the conversation is idle.
   */
  onApprovePlan?: (messageId: string, planId: string) => void
  /** Called when the person clicks "Change something" on a plan card. */
  onChangePlan?: (messageId: string, planId: string) => void
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
  onChoose,
  onApprovePlan,
  onChangePlan,
}: ConversationProps) {
  const compact = density === 'compact'
  const [showScrollButton, setShowScrollButton] = useState(false)
  const { turns, activeTurnId, setScrollEl, handleScroll, scrollToTurn } = useTurnRail(
    messages,
    containerRef,
    userScrolledUpRef,
  )
  let userMsgIdx = 0
  const latestPlanId = newestPlanId(messages)

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
              ? 'flex w-full flex-col gap-5 px-7 py-4'
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
                  onChoose={onChoose && (option => onChoose(msg.id, option))}
                  canChoose={isLastMessage && status === 'ready'}
                  onApprovePlan={onApprovePlan && (planId => onApprovePlan(msg.id, planId))}
                  onChangePlan={onChangePlan && (planId => onChangePlan(msg.id, planId))}
                  latestPlanId={latestPlanId}
                  canApprovePlan={status === 'ready'}
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
                  'text-destructive bg-destructive/10 w-fit rounded-lg px-3 py-2 text-sm',
                  compact && 'ml-10',
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
                className={cn('flex justify-start', compact && 'pl-10')}
              >
                <LoadingDots />
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      <TurnRail turns={turns} activeId={activeTurnId} onJump={scrollToTurn} />

      <div className={cn('relative shrink-0', compact ? 'px-7 pb-6' : 'px-4 pb-4')}>
        <ScrollToBottomButton
          show={showScrollButton && messages.length > 0}
          onClick={() => {
            userScrolledUpRef.current = false
            setShowScrollButton(false)
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
        {/* Same width as the transcript column, so the two line up. */}
        <div className={compact ? 'w-full' : 'mx-auto w-full max-w-3xl'}>
          {footer}
        </div>
      </div>
    </div>
  )
}

/** The id of the newest plan part in the conversation, if any. */
function newestPlanId(messages: UIMessage[]): string | undefined {
  for (let m = messages.length - 1; m >= 0; m--) {
    const parts = messages[m]?.parts ?? []
    for (let p = parts.length - 1; p >= 0; p--) {
      const part = parts[p] as { type: string, id?: string }
      if (part.type === PLAN_PART_TYPE && part.id)
        return part.id
    }
  }
  return undefined
}
