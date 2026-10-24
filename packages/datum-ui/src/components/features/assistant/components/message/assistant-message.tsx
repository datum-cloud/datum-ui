'use client'

import type { UIMessage } from 'ai'
import type { ExtraProps } from 'streamdown'
import type { AssistantChoiceOption, AssistantChoicesData, AssistantPlanData, ConversationDensity } from '../../types'
import {
  activeToolPart as findActiveToolPart,
  isReasoningUIPart,
  isStreamingMessage,
  isTextUIPart,
  isToolUIPart,
  hasText as messageHasText,
  messageText,
  showInitialLoading as shouldShowInitialLoading,
  showToolIndicator as shouldShowToolIndicator,
  toolLabel,
} from '@datum-cloud/datum-ui-assistant-core'
import { code } from '@streamdown/code'
import { Brain, Check, Copy, Download } from 'lucide-react'
import { Fragment, useState } from 'react'
import { Streamdown } from 'streamdown'
import { cn } from '../../../../../utils/cn'
import { Tooltip } from '../../../../base/tooltip'
import { Icon } from '../../../../icons/icon-wrapper'
import { useAssistantConfig } from '../../context'
import { CHOICES_PART_TYPE, PLAN_PART_TYPE } from '../../types'
import { AssistantChoiceChips } from './choice-chips'
import { LoadingDots } from './loading-dots'
import { AssistantPlanCard } from './plan-card'
import { ThinkingBlock } from './thinking-block'
import 'streamdown/styles.css'

interface AssistantMessageProps {
  msg: UIMessage
  isLastMessage: boolean
  status: string
  /**
   * `compact` puts the assistant avatar beside the turn, tightens markdown
   * spacing (headings render at body size), sets inline code as plain mono
   * text, and leaves out the copy and download actions (a host's own
   * `messageActions` still render).
   */
  density?: ConversationDensity
  /**
   * Called when the person picks an option of a question in this turn (a
   * `data-choices` part). The host sends the option's label as their reply.
   */
  onChoose?: (option: AssistantChoiceOption) => void
  /**
   * Whether this turn's question can still be answered: the host passes true
   * only for the latest turn once it has finished streaming.
   */
  canChoose?: boolean
  /** Called when the person approves a plan in this turn (a `data-plan` part), with its id. */
  onApprovePlan?: (planId: string) => void
  /** Called when the person asks to change a plan in this turn. */
  onChangePlan?: (planId: string) => void
  /** The id of the newest plan in the conversation; any other reads as replaced. */
  latestPlanId?: string
  /** Whether a plan can be approved now: the conversation is idle. */
  canApprovePlan?: boolean
}

/** Streamdown overrides shared by both densities (code surfaces). */
const STREAMDOWN_BASE_CLASSES
  = '**:data-[streamdown=\'code-block-body\']:bg-card **:data-[streamdown=\'inline-code\']:bg-card dark:**:data-[streamdown=\'inline-code\']:bg-accent **:data-[streamdown=\'inline-code\']:border'

/**
 * Markdown overrides for `compact`: tighter blocks, headings at body size, and
 * inline code that reads as part of the sentence (a long image reference wraps
 * anywhere instead of breaking the line around a bordered pill).
 */
const COMPACT_MARKDOWN_CLASSES = cn(
  'space-y-2 leading-relaxed',
  '[&_li]:py-0.5',
  '[&_:is(h1,h2,h3,h4,h5,h6)]:mt-3 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-1',
  '[&_:is(h1,h2,h3,h4,h5,h6)]:text-sm [&_:is(h1,h2,h3,h4,h5,h6)]:font-semibold',
  '**:data-[streamdown=\'code-block-body\']:bg-card',
  '**:data-[streamdown=\'inline-code\']:bg-transparent **:data-[streamdown=\'inline-code\']:p-0',
  '**:data-[streamdown=\'inline-code\']:text-[0.95em] **:data-[streamdown=\'inline-code\']:[overflow-wrap:anywhere]',
)

export function AssistantMessage({
  msg,
  isLastMessage,
  status,
  density = 'default',
  onChoose,
  canChoose = false,
  onApprovePlan,
  onChangePlan,
  latestPlanId,
  canApprovePlan = false,
}: AssistantMessageProps) {
  const { toolLabels, showReasoning, messageActions, renderLink, renderToolOutput }
    = useAssistantConfig()
  const isStreaming = isStreamingMessage({ isLastMessage, status })
  const hasText = messageHasText(msg)
  const activeToolPart = findActiveToolPart(msg)
  const showInitialLoading = shouldShowInitialLoading({ msg, isLastMessage, status })
  const showToolIndicator = shouldShowToolIndicator({ msg, isLastMessage })
  const compact = density === 'compact'

  const body = (
    <>
      {msg.parts.map((part, i) => {
        if (isReasoningUIPart(part)) {
          if (!showReasoning)
            return null
          const isThinkingStreaming = isStreaming && i === msg.parts.length - 1
          return <ThinkingBlock key={i} text={part.text} isStreaming={isThinkingStreaming} />
        }

        if (isTextUIPart(part) && part.text) {
          return (
            <Streamdown
              key={i}
              className={cn(
                compact
                  ? COMPACT_MARKDOWN_CLASSES
                  : `${STREAMDOWN_BASE_CLASSES} [&_h2]:text-xl [&_h3]:text-lg`,
                isStreaming
                && '**:data-[streamdown=\'inline-code\']:animate-[sd-blurIn_300ms_ease-out_both]',
              )}
              isAnimating={isStreaming}
              plugins={{ code }}
              animated={{
                animation: 'blurIn',
                duration: 300,
                easing: 'ease-out',
                sep: 'word',
                stagger: 30,
              }}
              components={{
                a: ({
                  href,
                  children,
                }: React.AnchorHTMLAttributes<HTMLAnchorElement> & ExtraProps) =>
                  renderLink({ href, children }),
                img: ({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement> & ExtraProps) => (
                  <img
                    src={src}
                    alt={alt ?? ''}
                    className="my-2 inline-block max-h-16 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ),
              }}
            >
              {part.text}
            </Streamdown>
          )
        }

        if (part.type === CHOICES_PART_TYPE) {
          return (
            <AssistantChoiceChips
              key={i}
              data={(part as { data: AssistantChoicesData }).data}
              onChoose={onChoose}
              disabled={!canChoose}
            />
          )
        }

        if (part.type === PLAN_PART_TYPE) {
          const { id, data } = part as { id?: string, data: AssistantPlanData }
          // A part with no id is malformed: show it, but nothing can name it
          // to approve, and it must not read as replaced either.
          const latest = !id || latestPlanId === undefined || latestPlanId === id
          return (
            <AssistantPlanCard
              key={i}
              data={data}
              latest={latest}
              canApprove={canApprovePlan && latest && id !== undefined && onApprovePlan !== undefined}
              onApprove={() => id && onApprovePlan?.(id)}
              onChange={() => id && onChangePlan?.(id)}
            />
          )
        }

        // Completed tool calls are invisible by default — a host opts a specific
        // tool into rendering its own output inline (cloud-portal turns an
        // `openSupportTicket` result into a button).
        if (isToolUIPart(part) && part.state === 'output-available' && renderToolOutput) {
          const rendered = renderToolOutput(part, msg)
          if (rendered)
            return <Fragment key={i}>{rendered}</Fragment>
        }

        return null
      })}

      {showInitialLoading && (
        <div className="py-1">
          <LoadingDots />
        </div>
      )}

      {showToolIndicator && activeToolPart && (
        <div className="text-muted-foreground flex items-center gap-1.5 py-1 text-xs">
          <span className="bg-muted-foreground/50 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" />
          <span className="bg-muted-foreground/50 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" />
          <span className="bg-muted-foreground/50 h-1.5 w-1.5 animate-bounce rounded-full" />
          <span>{toolLabel(activeToolPart, toolLabels)}</span>
        </div>
      )}

      {!isStreaming
        && hasText
        && (messageActions ? messageActions(msg) : !compact && <MessageActions msg={msg} />)}
    </>
  )

  if (!compact)
    return <div className="text-foreground w-full text-sm">{body}</div>

  return (
    <div className="text-foreground flex w-full gap-3 text-sm" data-density="compact">
      <AssistantAvatar />
      {/* pt-1 centres the first line (20px) on the 28px avatar. */}
      <div className="min-w-0 flex-1 pt-1">{body}</div>
    </div>
  )
}

/** The assistant's mark beside each compact turn. Decorative: the turn itself carries the content. */
function AssistantAvatar() {
  return (
    <span
      aria-hidden="true"
      data-slot="assistant-avatar"
      className="bg-btn-primary flex size-7 shrink-0 items-center justify-center rounded-full text-white"
    >
      <Icon icon={Brain} className="size-3.5" />
    </span>
  )
}

function MessageActions({ msg }: { msg: UIMessage }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText(msg))
      setCopied(true)
      setTimeout(setCopied, 1500, false)
    }
    catch {
      // clipboard unavailable
    }
  }

  const handleDownload = () => {
    const blob = new Blob([messageText(msg)], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'assistant-message.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div data-slot="message-actions" className="text-muted-foreground/60 mt-1.5 flex items-center gap-0.5">
      <Tooltip message={copied ? 'Copied' : 'Copy'} side="top">
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy message"
          className="hover:text-foreground rounded p-1 transition-colors"
        >
          {copied ? <Icon icon={Check} className="size-3.5" /> : <Icon icon={Copy} className="size-3.5" />}
        </button>
      </Tooltip>
      <Tooltip message="Download as Markdown" side="top">
        <button
          type="button"
          onClick={handleDownload}
          aria-label="Download message"
          className="hover:text-foreground rounded p-1 transition-colors"
        >
          <Icon icon={Download} className="size-3.5" />
        </button>
      </Tooltip>
    </div>
  )
}
