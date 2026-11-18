'use client'

import type { ConversationDensity } from '../../types'
import { useMemo, useSyncExternalStore } from 'react'
import { cn } from '../../../../../utils/cn'
import { sanitizeUserHtml, stripTagsToHtml } from '../../utils/sanitize-html'

// The server render has no DOMParser and shows plain text; hydration reads the
// server value first so the markup matches, then re-renders with the
// sanitized HTML. A client-only render goes straight to the sanitized HTML.
function subscribeNever(): () => void {
  return () => {}
}

function hasDomParser(): boolean {
  return typeof DOMParser !== 'undefined'
}

interface UserMessageProps {
  html: string
  /** `compact` uses a lighter bubble with even corners. */
  density?: ConversationDensity
}

/**
 * A user's message — a right-aligned bubble rendering the input HTML. It
 * sanitizes `html` itself rather than trusting the host to have done so.
 */
export function UserMessage({ html, density = 'default' }: UserMessageProps) {
  const compact = density === 'compact'
  const canParse = useSyncExternalStore(subscribeNever, hasDomParser, () => false)
  const safeHtml = useMemo(
    () => (canParse ? sanitizeUserHtml(html) : stripTagsToHtml(html)),
    [canParse, html],
  )
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
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </div>
    </div>
  )
}
