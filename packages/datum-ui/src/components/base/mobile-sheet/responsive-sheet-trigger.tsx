import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { MobileSheet } from './mobile-sheet'

interface ResponsiveSheetTriggerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Trigger element; its own onClick/onKeyDown are composed by Slot. */
  trigger: ReactNode
  children: ReactNode
  /** Title shown in the mobile sheet header */
  sheetTitle: string
  /** Description for the mobile sheet */
  sheetDescription?: string
  /** Optional footer shown at the bottom of the mobile sheet */
  sheetFooter?: ReactNode
}

/**
 * Shared mobile branch for ResponsivePopover and ResponsiveDropdown: renders the
 * trigger via Radix Slot and opens a MobileSheet.
 *
 * Slot already composes the child trigger's own onClick/onKeyDown before running
 * ours, so we must NOT invoke `trigger.props.onClick` manually (that would fire
 * the child handler twice). We only toggle open state, and only when the child
 * handler has not already called preventDefault.
 */
export function ResponsiveSheetTrigger({
  open,
  onOpenChange,
  trigger,
  children,
  sheetTitle,
  sheetDescription,
  sheetFooter,
}: ResponsiveSheetTriggerProps) {
  const handleTriggerClick = (e: ReactMouseEvent<HTMLElement>) => {
    if (!e.defaultPrevented)
      onOpenChange(!open)
  }

  const handleTriggerKeyDown = (e: ReactKeyboardEvent<HTMLElement>) => {
    if (!e.defaultPrevented && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onOpenChange(!open)
    }
  }

  return (
    <>
      <Slot onClick={handleTriggerClick} onKeyDown={handleTriggerKeyDown}>
        {trigger}
      </Slot>
      <MobileSheet
        open={open}
        onOpenChange={onOpenChange}
        title={sheetTitle}
        description={sheetDescription}
        footer={sheetFooter}
      >
        {children}
      </MobileSheet>
    </>
  )
}
