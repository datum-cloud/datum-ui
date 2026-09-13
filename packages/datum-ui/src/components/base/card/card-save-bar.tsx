import * as React from 'react'
import { cn } from '../../../utils/cn'
import { Button } from '../button'
import { CardFooter } from './card'

export interface CardSaveBarProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Number of fields that differ from their saved value. */
  changeCount: number
  /** Number of fields that currently fail validation. Save is blocked while > 0. */
  errorCount?: number
  /** A save is in flight: Save shows a spinner and both buttons are disabled. */
  saving?: boolean
  onCancel: () => void
  onSave: () => void
  cancelLabel?: string
  saveLabel?: string
  /**
   * Replaces the generated "N unsaved changes" status. The error summary is
   * still appended when `errorCount` is non-zero.
   */
  children?: React.ReactNode
}

function pluralize(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}

/**
 * Save / cancel bar for inline-editable settings cards.
 *
 * Renders in a bordered `CardFooter` and owns the pattern every settings card
 * repeats: a live status line ("2 unsaved changes · 1 error must be fixed"),
 * a Cancel button, and a Save button that is disabled until something has
 * changed and nothing is invalid. Buttons use the `xs` size to match the
 * `CardAction` controls in the header of a `size="sm"` sectioned card.
 */
function CardSaveBar({
  changeCount,
  errorCount = 0,
  saving = false,
  onCancel,
  onSave,
  cancelLabel = 'Cancel',
  saveLabel = 'Save changes',
  children,
  className,
  ...props
}: CardSaveBarProps) {
  const status = children ?? (
    changeCount === 0 ? 'No unsaved changes' : pluralize(changeCount, 'unsaved change')
  )

  return (
    <CardFooter
      bordered
      data-slot="card-save-bar"
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      {...props}
    >
      <p className="text-muted-foreground flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm">
        <span className="text-foreground font-medium">{status}</span>
        {errorCount > 0
          ? (
              <>
                <span aria-hidden>·</span>
                <span className="text-destructive">
                  {pluralize(errorCount, 'error')}
                  {' '}
                  must be fixed before saving
                </span>
              </>
            )
          : null}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="secondary"
          theme="outline"
          size="xs"
          disabled={saving}
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        <Button
          type="primary"
          theme="solid"
          size="xs"
          disabled={changeCount === 0 || errorCount > 0 || saving}
          loading={saving}
          onClick={onSave}
        >
          {saveLabel}
        </Button>
      </div>
    </CardFooter>
  )
}

export { CardSaveBar }
