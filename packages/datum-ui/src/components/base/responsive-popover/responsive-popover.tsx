import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/shadcn/ui/popover'
import { isValidElement } from 'react'
import { useBreakpoint } from '../../../hooks/use-breakpoint'
import { cn } from '../../../utils/cn'
import { MobileSheet, useInSheet } from '../mobile-sheet'

interface ResponsivePopoverProps {
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
  /** PopoverContent alignment (desktop only). @default 'start' (matches Radix Popover default) */
  align?: 'start' | 'center' | 'end'
  /** PopoverContent side (desktop only) */
  side?: 'top' | 'right' | 'bottom' | 'left'
  contentClassName?: string
  /** Distance in pixels from the trigger (desktop only). */
  sideOffset?: number
  /** Offset along the alignment axis in pixels (desktop only). */
  alignOffset?: number
  /** Whether the popover should avoid the boundary edges by flipping side (desktop only). @default true */
  avoidCollisions?: boolean
  /** Called when PopoverContent auto-focuses on open (desktop only). */
  onOpenAutoFocus?: (e: Event) => void
  /** Called when PopoverContent auto-focuses on close (desktop only). */
  onCloseAutoFocus?: (e: Event) => void
  /** Called when an interaction outside the content fires (desktop only). */
  onInteractOutside?: (e: Event) => void
  /** Called when the Escape key is pressed inside the content (desktop only). */
  onEscapeKeyDown?: (e: KeyboardEvent) => void
  /**
   * Force desktop popover even on mobile. Default: true (responsive).
   * Use for components that should never render as a sheet.
   */
  responsive?: boolean
  /**
   * Whether the popover is modal (prevents interaction with elements outside).
   * Required when used inside a Dialog/Modal component. Desktop only.
   * @default true
   */
  modal?: boolean
}

export function ResponsivePopover({
  open,
  onOpenChange,
  trigger,
  children,
  sheetTitle,
  sheetDescription,
  sheetFooter,
  align = 'start',
  side = 'bottom',
  contentClassName,
  sideOffset,
  alignOffset,
  avoidCollisions,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onInteractOutside,
  onEscapeKeyDown,
  responsive = true,
  modal,
}: ResponsivePopoverProps) {
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
    <Popover open={open} onOpenChange={onOpenChange} modal={modal}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        avoidCollisions={avoidCollisions}
        className={cn('p-0', contentClassName)}
        onOpenAutoFocus={onOpenAutoFocus}
        onCloseAutoFocus={onCloseAutoFocus}
        onInteractOutside={onInteractOutside}
        onEscapeKeyDown={onEscapeKeyDown}
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}
