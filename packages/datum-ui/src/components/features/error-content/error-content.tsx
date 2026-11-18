'use client'

import type { EmptyContentAction } from '../empty-content'
import { cva } from 'class-variance-authority'
import { useCopyToClipboard } from '../../../hooks/use-copy-to-clipboard'
import { cn } from '../../../utils/cn'
import { ContentAction } from '../empty-content/content-action'
import { useDescribeError } from './error-description-context'

const containerVariants = cva('flex flex-col items-center gap-3 text-center', {
  variants: {
    variant: {
      default: 'rounded-lg border border-border px-6 py-7',
      minimal: 'px-4 py-6',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface ErrorContentProps {
  /** The error to describe, with the tree's `useDescribeError()`. */
  error?: unknown
  /** Replaces the described title. */
  title?: string
  /** Replaces the described next step. */
  description?: string
  actions?: EmptyContentAction[]
  variant?: 'default' | 'minimal'
  className?: string
}

/**
 * An error, told plainly: a headline, what to do next, actions, and the raw
 * technical text in a collapsed "Error details" section that can be copied.
 */
export function ErrorContent({ error, title, description, actions = [], variant, className }: ErrorContentProps) {
  const described = useDescribeError()(error)
  const [, copy] = useCopyToClipboard()
  const visibleActions = actions.filter(action => !action.hidden)
  const shownTitle = title ?? described.title
  const shownDescription = description ?? described.description
  // An unrecognised error keeps its message as the title; don't repeat it.
  const detail = described.detail === shownTitle ? undefined : described.detail

  return (
    <div role="alert" className={cn(containerVariants({ variant }), className)}>
      <h3 className="text-foreground text-sm font-medium">{shownTitle}</h3>
      {shownDescription && <p className="text-muted-foreground text-xs">{shownDescription}</p>}
      {visibleActions.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {visibleActions.map(action => (
            <ContentAction key={`${action.as ?? 'button'}-${action.label}`} action={action} buttonSize="xs" />
          ))}
        </div>
      )}
      {detail && (
        <details className="w-full max-w-md text-left">
          <summary className="text-muted-foreground cursor-pointer text-xs">Error details</summary>
          <div className="bg-muted mt-2 flex items-start gap-2 rounded-md p-2">
            <pre className="text-foreground min-w-0 flex-1 font-mono text-xs break-words whitespace-pre-wrap">
              {detail}
              {described.requestId && `\nRequest ID: ${described.requestId}`}
            </pre>
            <button
              type="button"
              aria-label="Copy error details"
              className="text-muted-foreground hover:text-foreground text-xs"
              onClick={() => copy(detail)}
            >
              Copy
            </button>
          </div>
        </details>
      )}
    </div>
  )
}
