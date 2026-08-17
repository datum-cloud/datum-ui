import type { ReactNode } from 'react'
import { useBreakpoint } from '../../../hooks/use-breakpoint'
import { cn } from '../../../utils/cn'
import { ResponsiveSheetTrigger, useInSheet } from '../mobile-sheet'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

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
  /** PopoverContent alignment (desktop only). @default 'end' (matches existing convention for row-action menus) */
  align?: 'start' | 'center' | 'end'
  contentClassName?: string
  /** Called when PopoverContent auto-focuses on close (desktop only) */
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
    return (
      <ResponsiveSheetTrigger
        open={open}
        onOpenChange={onOpenChange}
        trigger={trigger}
        sheetTitle={sheetTitle}
        sheetDescription={sheetDescription}
        sheetFooter={sheetFooter}
      >
        {children}
      </ResponsiveSheetTrigger>
    )
  }

  // Desktop uses a Popover rather than a DropdownMenu: Radix menus (≥2.1.17)
  // close on window blur, which unmounts content that opens the native file
  // picker (e.g. a Dropzone) before the selection ever lands. Children here
  // are arbitrary interactive content, not menu items, so popover (dialog)
  // semantics are also the correct a11y fit.
  return (
    <Popover open={open} onOpenChange={onOpenChange} modal>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        className={cn(
          'max-h-(--radix-popover-content-available-height) w-auto min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-lg p-0',
          contentClassName,
        )}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}
