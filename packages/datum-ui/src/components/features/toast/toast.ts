import type { ExternalToast } from 'sonner'
import type { HeadlessToastAction, HeadlessToastVariant } from './headless-toast'
import { createElement } from 'react'
import { toast as sonnerToast } from 'sonner'
import { HeadlessToast } from './headless-toast'

/**
 * Normalize a sonner `action`/`cancel` option (which may be an object with
 * `{ label, onClick }` or arbitrary ReactNode) into a `HeadlessToastAction`
 * that our headless renderer can display. Returns `undefined` for the ReactNode
 * form or when no handler is present. The toast is dismissed after the handler
 * runs, matching sonner's default action behavior.
 */
function normalizeAction(
  action: ExternalToast['action'] | ExternalToast['cancel'],
  dismiss: () => void,
): HeadlessToastAction | undefined {
  if (action == null || typeof action !== 'object' || !('onClick' in action)) {
    return undefined
  }
  const { label, onClick } = action as {
    label: HeadlessToastAction['label']
    onClick?: (event: unknown) => void
  }
  return {
    label,
    onClick: () => {
      onClick?.(undefined)
      dismiss()
    },
  }
}

const defaultOptions = {
  message: { duration: 5000 },
  success: { duration: 5000 },
  error: { duration: Infinity },
  info: { duration: 5000 },
  warning: { duration: 5000 },
}

function show(variant: HeadlessToastVariant, title: string, options?: ExternalToast) {
  const merged = { ...defaultOptions[variant], ...options }
  const { description, action, cancel, ...sonnerOptions } = merged as ExternalToast
  const resolvedDescription = typeof description === 'function' ? description() : description

  return sonnerToast.custom(
    (t: string | number) => {
      const dismiss = () => sonnerToast.dismiss(t)
      return createElement(HeadlessToast, {
        variant,
        title,
        description: resolvedDescription,
        action: normalizeAction(action, dismiss),
        cancel: normalizeAction(cancel, dismiss),
        onDismiss: dismiss,
      })
    },
    sonnerOptions,
  )
}

export const toast = {
  message: (title: string, options?: ExternalToast) => {
    return show('message', title, options)
  },
  success: (title: string, options?: ExternalToast) => {
    return show('success', title, options)
  },
  error: (title: string, options?: ExternalToast) => {
    return show('error', title, options)
  },
  info: (title: string, options?: ExternalToast) => {
    return show('info', title, options)
  },
  warning: (title: string, options?: ExternalToast) => {
    return show('warning', title, options)
  },
}
