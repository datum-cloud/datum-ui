'use client'

import type { UIMessage } from 'ai'
import type { ExtraProps } from 'streamdown'
import { code } from '@streamdown/code'
import { getToolName, isReasoningUIPart, isTextUIPart, isToolUIPart } from 'ai'
import { Check, Copy, Download } from 'lucide-react'
import { Fragment, useState } from 'react'
import { Streamdown } from 'streamdown'
import { cn } from '../../../../../utils/cn'
import { Tooltip } from '../../../../base/tooltip'
import { useAssistantConfig } from '../../context'
import { LoadingDots } from './loading-dots'
import { ThinkingBlock } from './thinking-block'
import 'streamdown/styles.css'

interface AssistantMessageProps {
  msg: UIMessage
  isLastMessage: boolean
  status: string
}

function messageText(msg: UIMessage): string {
  return msg.parts
    .filter(isTextUIPart)
    .map(p => p.text)
    .join('\n\n')
}

export function AssistantMessage({ msg, isLastMessage, status }: AssistantMessageProps) {
  const { toolLabels, showReasoning, messageActions, renderLink, renderToolOutput }
    = useAssistantConfig()
  const isStreaming = isLastMessage && status === 'streaming'
  const hasText = msg.parts.some(p => isTextUIPart(p) && p.text)
  const activeToolPart = msg.parts.find(
    p => isToolUIPart(p) && (p.state === 'input-streaming' || p.state === 'input-available'),
  )
  const showInitialLoading = isStreaming && !hasText && !activeToolPart
  const showToolIndicator = isLastMessage && activeToolPart != null

  return (
    <div className="text-foreground w-full text-sm">
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
                '**:data-[streamdown=\'code-block-body\']:bg-card **:data-[streamdown=\'inline-code\']:bg-card dark:**:data-[streamdown=\'inline-code\']:bg-accent **:data-[streamdown=\'inline-code\']:border [&_h2]:text-xl [&_h3]:text-lg',
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

      {showToolIndicator && (
        <div className="text-muted-foreground flex items-center gap-1.5 py-1 text-xs">
          <span className="bg-muted-foreground/50 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" />
          <span className="bg-muted-foreground/50 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" />
          <span className="bg-muted-foreground/50 h-1.5 w-1.5 animate-bounce rounded-full" />
          <span>{toolLabels[getToolName(activeToolPart)] ?? 'Working…'}</span>
        </div>
      )}

      {!isStreaming
        && hasText
        && (messageActions ? messageActions(msg) : <MessageActions msg={msg} />)}
    </div>
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
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </Tooltip>
      <Tooltip message="Download as Markdown" side="top">
        <button
          type="button"
          onClick={handleDownload}
          aria-label="Download message"
          className="hover:text-foreground rounded p-1 transition-colors"
        >
          <Download className="size-3.5" />
        </button>
      </Tooltip>
    </div>
  )
}
