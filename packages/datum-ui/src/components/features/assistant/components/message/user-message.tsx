'use client'

import type { ConversationDensity } from '../../types'
import { cn } from '../../../../../utils/cn'

interface UserMessageProps {
  html: string
  /** `compact` uses a lighter bubble with even corners. */
  density?: ConversationDensity
}

/** A user's message — a right-aligned bubble rendering the sanitized input HTML. */
export function UserMessage({ html, density = 'default' }: UserMessageProps) {
  const compact = density === 'compact'
  return (
    <div className="flex justify-end">
      <div
        className={cn(
          'text-foreground max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
          compact ? 'bg-muted' : 'bg-border rounded-br-sm',
        )}
      >
        <div
          className="[&_em]:italic [&_p]:my-0.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_s]:line-through [&_strong]:font-semibold [&_u]:underline"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
