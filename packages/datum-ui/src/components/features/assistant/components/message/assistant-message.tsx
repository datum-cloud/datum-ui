'use client'

import type { UIMessage } from 'ai'
import type { ExtraProps } from 'streamdown'
import type { ConversationDensity } from '../../types'
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
import { Check, Copy, Download } from 'lucide-react'
import { Fragment, useState } from 'react'
import { Streamdown } from 'streamdown'
import { cn } from '../../../../../utils/cn'
import { Tooltip } from '../../../../base/tooltip'
import { Icon } from '../../../../icons/icon-wrapper'
import { useAssistantConfig } from '../../context'
import { BrainGlyph } from '../brain-glyph'
import { LoadingDots } from './loading-dots'
import { ThinkingBlock } from './thinking-block'
import 'streamdown/styles.css'

interface AssistantMessageProps {
  msg: UIMessage
  isLastMessage: boolean
  status: string
  /**
   * `compact` puts the assistant avatar beside the turn, drops the body text
   * one step and tightens markdown spacing (headings render at body size).
   */
  density?: ConversationDensity
}

/** Streamdown overrides shared by both densities (code surfaces). */
const STREAMDOWN_BASE_CLASSES
  = '**:data-[streamdown=\'code-block-body\']:bg-card **:data-[streamdown=\'inline-code\']:bg-card dark:**:data-[streamdown=\'inline-code\']:bg-accent **:data-[streamdown=\'inline-code\']:border'

/** Markdown overrides for `compact`: tighter blocks, headings at body size. */
const COMPACT_MARKDOWN_CLASSES = cn(
  'space-y-2',
  '[&_li]:py-0.5',
  '[&_:is(h1,h2,h3,h4,h5,h6)]:mt-3 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-1',
  '[&_:is(h1,h2,h3,h4,h5,h6)]:text-xs [&_:is(h1,h2,h3,h4,h5,h6)]:font-semibold',
)

export function AssistantMessage({
  msg,
  isLastMessage,
  status,
  density = 'default',
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
                  ? `${STREAMDOWN_BASE_CLASSES} ${COMPACT_MARKDOWN_CLASSES}`
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
        && (messageActions ? messageActions(msg) : <MessageActions msg={msg} />)}
    </>
  )

  if (!compact)
    return <div className="text-foreground w-full text-sm">{body}</div>

  return (
    <div className="text-foreground flex w-full gap-3 text-xs" data-density="compact">
      <AssistantAvatar />
      <div className="min-w-0 flex-1">{body}</div>
    </div>
  )
}

/** The assistant's mark beside each compact turn. Decorative: the turn itself carries the content. */
function AssistantAvatar() {
  return (
    <span
      aria-hidden="true"
      data-slot="assistant-avatar"
      className="bg-muted flex size-6 shrink-0 items-center justify-center rounded-full"
    >
      <BrainGlyph className="size-4" />
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
    <div className="text-muted-foreground/60 mt-1.5 flex items-center gap-0.5">
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
