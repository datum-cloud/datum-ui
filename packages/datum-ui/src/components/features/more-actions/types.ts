import type { ComponentType, ReactNode } from 'react'

/** Confirm step shown in a dialog before an action runs. */
export interface ActionConfirm<TData> {
  /** Dialog title — a node, or a function receiving the data item. */
  title: ReactNode | ((data: TData) => ReactNode)
  /** Supporting text under the title — a node, or a function receiving the data item. */
  description?: ReactNode | ((data: TData) => ReactNode)
  /** Label of the button that runs the action. Defaults to "Confirm". */
  confirmLabel?: ReactNode
  /** Label of the button that closes the dialog. Defaults to "Cancel". */
  cancelLabel?: ReactNode
}

export interface ActionItem<TData> {
  /** Unique key for the action (required by more-actions for React keying) */
  key?: string
  /** Display label for the action */
  label: string
  /** Click handler — receives the row/data item */
  onClick: (data: TData) => void | Promise<void>
  /** Optional icon — accepts ComponentType or ReactNode for flexibility */
  icon?: ComponentType<{ className?: string }> | ReactNode
  /** Visual variant. 'destructive' renders red text + icon. */
  variant?: 'default' | 'destructive'
  /**
   * Ask before running. Clicking the item opens a dialog and `onClick` runs only
   * after the user confirms. When `onClick` returns a promise the dialog stays
   * open with both buttons disabled until it settles: it closes on resolve and
   * stays open on reject, so report the error from `onClick` itself.
   */
  confirm?: ActionConfirm<TData>
  /** Disable the action. Boolean or function receiving the data item. */
  disabled?: boolean | ((data: TData) => boolean)
  /** Hide the action. Boolean or function receiving the data item. */
  hidden?: boolean | ((data: TData) => boolean)
  /** Additional CSS classes for the action row button */
  className?: string
  /** Tooltip text — static string or function receiving the data item */
  tooltip?: string | ((data: TData) => string)
}
