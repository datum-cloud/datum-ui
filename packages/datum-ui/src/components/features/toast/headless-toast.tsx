import type { LucideIcon } from 'lucide-react'
import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { CloseIcon } from '../../icons/close.icon'

export type HeadlessToastVariant = 'message' | 'success' | 'error' | 'info' | 'warning'

export interface HeadlessToastAction {
  label: React.ReactNode
  onClick: () => void
}

export interface HeadlessToastProps {
  variant: HeadlessToastVariant
  title: string
  description?: React.ReactNode
  action?: HeadlessToastAction
  cancel?: HeadlessToastAction
  onDismiss: () => void
}

const variantAccentClass: Record<HeadlessToastVariant, string> = {
  // `message` carries no status. It keeps the default (success) surface it has
  // always had, so plain `toast()` calls look the same as before.
  message: 'bg-toast-success-background text-toast-success-foreground',
  info: 'bg-toast-info-background text-toast-info-foreground',
  success: 'bg-toast-success-background text-toast-success-foreground',
  warning: 'bg-toast-warning-background text-toast-warning-foreground',
  error: 'bg-toast-error-background text-toast-error-foreground',
}

const variantIconClass: Record<HeadlessToastVariant, string> = {
  message: 'fill-toast-success-icon',
  info: 'fill-toast-info-icon',
  success: 'fill-toast-success-icon',
  warning: 'fill-toast-warning-icon',
  error: 'fill-toast-error-icon',
}

interface StatusIcon {
  Icon: LucideIcon
  label: string
}

// Status must not rely on colour alone, so each status variant also gets an
// icon with an accessible name. `message` has no status and no icon.
const variantStatusIcon: Record<HeadlessToastVariant, StatusIcon | null> = {
  message: null,
  info: { Icon: Info, label: 'Info' },
  success: { Icon: CircleCheck, label: 'Success' },
  warning: { Icon: TriangleAlert, label: 'Warning' },
  error: { Icon: CircleX, label: 'Error' },
}

export function HeadlessToast({ variant, title, description, action, cancel, onDismiss }: HeadlessToastProps) {
  const status = variantStatusIcon[variant]

  return (
    <div
      data-variant={variant}
      className={cn(
        'bg-background text-foreground pointer-events-auto w-90 max-w-[calc(100vw-2rem)] overflow-hidden rounded-[10px]',
        'flex gap-2.5 px-5 py-4 text-xs',
        variantAccentClass[variant],
      )}
    >
      {status
        ? <status.Icon role="img" aria-label={status.label} className="mt-px size-3.5 shrink-0" />
        : null}
      <div className="relative flex min-w-0 flex-1 flex-col gap-1">
        <div className="font-semibold">{title}</div>
        {description ? <div>{description}</div> : null}

        {action || cancel
          ? (
              <div className="mt-2 flex items-center gap-2">
                {action
                  ? (
                      <button
                        type="button"
                        onClick={action.onClick}
                        className="rounded-md bg-current/10 px-2.5 py-1 font-medium transition-opacity hover:opacity-80"
                      >
                        {action.label}
                      </button>
                    )
                  : null}
                {cancel
                  ? (
                      <button
                        type="button"
                        onClick={cancel.onClick}
                        className="rounded-md px-2.5 py-1 font-medium opacity-70 transition-opacity hover:opacity-100"
                      >
                        {cancel.label}
                      </button>
                    )
                  : null}
              </div>
            )
          : null}

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="absolute -top-1.5 -right-2.5 transition-opacity hover:opacity-90"
        >
          <CloseIcon className="size-4.5" fill={variantIconClass[variant]} />
        </button>
      </div>
    </div>
  )
}
