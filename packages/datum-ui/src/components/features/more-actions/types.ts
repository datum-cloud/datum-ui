import type { ComponentType, ReactNode } from 'react'

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
  /** Disable the action. Boolean or function receiving the data item. */
  disabled?: boolean | ((data: TData) => boolean)
  /** Hide the action. Boolean or function receiving the data item. */
  hidden?: boolean | ((data: TData) => boolean)
  /** Additional CSS classes for the action row button */
  className?: string
  /** Tooltip text — static string or function receiving the data item */
  tooltip?: string | ((data: TData) => string)
}
