import type { ReactNode, RefObject, SyntheticEvent } from 'react'
import type { ActionConfirm, ActionItem } from './types'
import { useState } from 'react'
import { Button } from '../../base/button'
import { Dialog } from '../../base/dialog'

interface ConfirmActionDialogProps<TData> {
  action: ActionItem<TData>
  confirm: ActionConfirm<TData>
  data: TData
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called once the action has run (and, for a promise, resolved). */
  onConfirmed: () => void
  /** Element that opened the dialog; takes focus back when the dialog closes. */
  returnFocusRef: RefObject<HTMLElement | null>
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return typeof value === 'object' && value !== null && typeof (value as { then?: unknown }).then === 'function'
}

function stopPropagation(e: SyntheticEvent) {
  e.stopPropagation()
}

export function ConfirmActionDialog<TData,>({
  action,
  confirm,
  data,
  open,
  onOpenChange,
  onConfirmed,
  returnFocusRef,
}: ConfirmActionDialogProps<TData>) {
  const [isPending, setIsPending] = useState(false)

  const resolve = (value: ReactNode | ((data: TData) => ReactNode)) =>
    typeof value === 'function' ? value(data) : value

  const finish = () => {
    onOpenChange(false)
    onConfirmed()
  }

  const handleConfirm = () => {
    const result = action.onClick(data)
    if (!isPromiseLike(result)) {
      finish()
      return
    }
    setIsPending(true)
    result.then(
      () => {
        setIsPending(false)
        finish()
      },
      // A rejection keeps the dialog open so the user can retry or cancel;
      // `onClick` owns reporting the error.
      () => setIsPending(false),
    )
  }

  return (
    // The dialog is portaled, but React still bubbles its events through this
    // tree, so stop them here before they reach a clickable table row.
    <span className="contents" onClick={stopPropagation} onKeyDown={stopPropagation}>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          // Escape and outside clicks must not dismiss a running action.
          if (!isPending)
            onOpenChange(next)
        }}
      >
        <Dialog.Content
          className="sm:max-w-md"
          onCloseAutoFocus={(e) => {
            // A controlled dialog has no Dialog.Trigger, so Radix would drop
            // focus on <body>. After a confirmed action the menu has closed
            // and already moved focus to its own trigger.
            e.preventDefault()
            if (returnFocusRef.current?.isConnected)
              returnFocusRef.current.focus()
          }}
        >
          <Dialog.Header title={resolve(confirm.title)} description={resolve(confirm.description)} />
          <Dialog.Footer className="border-t-0">
            <Button type="tertiary" theme="outline" disabled={isPending} onClick={() => onOpenChange(false)}>
              {confirm.cancelLabel ?? 'Cancel'}
            </Button>
            <Button
              type={action.variant === 'destructive' ? 'danger' : 'primary'}
              theme="solid"
              loading={isPending}
              onClick={handleConfirm}
            >
              {confirm.confirmLabel ?? 'Confirm'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </span>
  )
}
