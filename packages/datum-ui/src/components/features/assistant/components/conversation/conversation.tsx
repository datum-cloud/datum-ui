'use client'

import type { UIMessage } from 'ai'
import type { RefObject } from 'react'
import { isTextUIPart } from 'ai'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { sanitizeUserHtml } from '../../sanitize-html'
import { useTurnRail } from '../../use-turn-rail'
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
}: ConversationProps) {
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
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
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
                  <UserMessage html={html ?? sanitizeUserHtml(fallbackText)} />
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
                <AssistantMessage msg={msg} isLastMessage={isLastMessage} status={status} />
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
                className="text-destructive bg-destructive/10 w-fit rounded-lg px-3 py-2 text-sm"
              >
                {error.message.includes('429') || error.message.includes('Too Many')
                  ? 'Easy there, speed racer! You\'ve hit the rate limit. Give it a minute and try again.'
                  : error.message.includes('503') || error.message.includes('not configured')
                    ? 'AI assistant is not configured.'
                    : `Something went wrong — ${error.message}`}
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
                className="flex justify-start"
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
        <div className="mx-auto w-full max-w-3xl">{footer}</div>
      </div>
    </div>
  )
}
