import type { ReactNode } from 'react'
import { cn } from '../../../../utils/cn'
import { ResponsivePopover } from '../../../base/responsive-popover'
import { usePickerContext } from './context'

interface PickerContentProps {
  trigger: ReactNode
  sheetTitle: string
  sheetDescription?: string
  footer?: ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  modal?: boolean
  contentClassName?: string
  children: ReactNode
}

export function PickerContent({
  trigger,
  sheetTitle,
  sheetDescription,
  footer,
  align = 'start',
  side = 'bottom',
  modal,
  contentClassName,
  children,
}: PickerContentProps) {
  const { state, actions, effectiveCommit, responsive, breakpoint } = usePickerContext()

  const isMobileSheet = responsive && breakpoint === 'mobile'
  const desktopFooter = !isMobileSheet && effectiveCommit === 'apply' ? footer : null
  const sheetFooter = isMobileSheet ? footer : undefined

  return (
    <ResponsivePopover
      open={state.open}
      onOpenChange={open => (open ? actions.open() : actions.close())}
      trigger={trigger}
      sheetTitle={sheetTitle}
      sheetDescription={sheetDescription}
      sheetFooter={sheetFooter}
      align={align}
      side={side}
      modal={modal}
      responsive={responsive}
      contentClassName={cn('w-auto', contentClassName)}
    >
      <div className="flex flex-col">
        <div className="flex flex-col">{children}</div>
        {desktopFooter && (
          <div className="border-t p-3">
            {desktopFooter}
          </div>
        )}
      </div>
    </ResponsivePopover>
  )
}

PickerContent.displayName = 'Picker.Content'
