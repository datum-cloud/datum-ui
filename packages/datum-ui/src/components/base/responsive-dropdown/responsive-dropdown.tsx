import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { isValidElement } from 'react'
import { useBreakpoint } from '../../../hooks/use-breakpoint'
import { cn } from '../../../utils/cn'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../../features/dropdown'
import { MobileSheet, useInSheet } from '../mobile-sheet'

interface ResponsiveDropdownProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: ReactNode
  children: ReactNode
  /** Title shown in the mobile sheet header */
  sheetTitle: string
  /** Description for the mobile sheet */
  sheetDescription?: string
  /** Optional footer shown at the bottom of the mobile sheet (mobile only). */
  sheetFooter?: ReactNode
  /** DropdownMenuContent alignment (desktop only). @default 'end' (matches existing DropdownMenu convention for row-action menus) */
  align?: 'start' | 'center' | 'end'
  contentClassName?: string
  /** Called when DropdownMenuContent auto-focuses on close (desktop only) */
  onCloseAutoFocus?: (e: Event) => void
  /**
   * Force desktop dropdown even on mobile. Default: true (responsive).
   */
  responsive?: boolean
}

export function ResponsiveDropdown({
  open,
  onOpenChange,
  trigger,
  children,
  sheetTitle,
  sheetDescription,
  sheetFooter,
  align = 'end',
  contentClassName,
  onCloseAutoFocus,
  responsive = true,
}: ResponsiveDropdownProps) {
  const breakpoint = useBreakpoint()
  const inSheet = useInSheet()
  const useMobileSheet = responsive && breakpoint === 'mobile' && !inSheet

  if (useMobileSheet) {
    const handleTriggerClick = (e?: ReactMouseEvent<HTMLElement>) => {
      if (e && isValidElement<{ onClick?: (e: ReactMouseEvent<HTMLElement>) => void }>(trigger)) {
        trigger.props.onClick?.(e)
      }
      if (!e?.defaultPrevented)
        onOpenChange(!open)
    }

    const handleTriggerKeyDown = (e?: ReactKeyboardEvent<HTMLElement>) => {
      if (!e)
        return
      if (isValidElement<{ onKeyDown?: (e: ReactKeyboardEvent<HTMLElement>) => void }>(trigger)) {
        trigger.props.onKeyDown?.(e)
      }
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

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn('rounded-lg p-0', contentClassName)}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
