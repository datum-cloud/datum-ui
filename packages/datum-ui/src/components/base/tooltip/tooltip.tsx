import type { ReactNode } from 'react'
import * as TooltipPrimitiveRadix from '@radix-ui/react-tooltip'
import { Tooltip as TooltipPrimitive, TooltipTrigger } from '@repo/shadcn/ui/tooltip'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../../../utils/cn'

interface TooltipProps {
  message: string | ReactNode
  children: ReactNode
  delayDuration?: number
  // Advanced props passed to TooltipContent
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  hidden?: boolean
  // Controlled state props
  open?: boolean
  onOpenChange?: (open: boolean) => void
  contentClassName?: string
  arrowClassName?: string
}

const LONG_PRESS_DURATION = 500
const AUTO_DISMISS_DURATION = 1500

function TooltipContent({
  className,
  arrowClassName,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitiveRadix.Content> & {
  arrowClassName?: string
}) {
  return (
    <TooltipPrimitiveRadix.Portal>
      <TooltipPrimitiveRadix.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'tooltip-content',
          'bg-secondary text-secondary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance max-w-[calc(100vw-2rem)]',
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitiveRadix.Arrow
          className={cn(
            'fill-secondary -my-px border-none drop-shadow-[0_1px_0_secondary]',
            arrowClassName,
          )}
          width={12}
          height={7}
          aria-hidden="true"
        />
      </TooltipPrimitiveRadix.Content>
    </TooltipPrimitiveRadix.Portal>
  )
}

/**
 * Touch long-press tooltip — renders a simple positioned tooltip bubble
 * completely independent of Radix. This avoids Radix's internal pointer
 * capture which blocks scrolling after tooltip dismissal.
 */
function TouchTooltipBubble({
  message,
  side = 'bottom',
}: {
  message: ReactNode
  side?: string
}) {
  const positionClass
    = side === 'bottom'
      ? 'top-full mt-1'
      : side === 'left'
        ? 'right-full mr-1 top-1/2 -translate-y-1/2'
        : side === 'right'
          ? 'left-full ml-1 top-1/2 -translate-y-1/2'
          : 'bottom-full mb-1'

  return (
    <div
      className={cn(
        'animate-in fade-in-0 zoom-in-95 pointer-events-none absolute z-50',
        'bg-secondary text-secondary-foreground rounded-md px-3 py-1.5 text-xs text-balance',
        'left-1/2 max-w-[calc(100vw-2rem)] -translate-x-1/2',
        positionClass,
      )}
      role="tooltip"
    >
      <span>{message}</span>
    </div>
  )
}

export function Tooltip({
  message,
  children,
  delayDuration = 200,
  side,
  align,
  sideOffset,
  hidden,
  open,
  onOpenChange,
  contentClassName,
  arrowClassName,
}: TooltipProps) {
  const [longPressVisible, setLongPressVisible] = useState(false)
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current)
      dismissTimerRef.current = null
    }
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  const handleTouchStart = useCallback(() => {
    clearTimers()
    pressTimerRef.current = setTimeout(() => {
      setLongPressVisible(true)
      dismissTimerRef.current = setTimeout(() => {
        setLongPressVisible(false)
      }, AUTO_DISMISS_DURATION)
    }, LONG_PRESS_DURATION)
  }, [clearTimers])

  const handleTouchMove = useCallback(() => {
    clearTimers()
    setLongPressVisible(false)
  }, [clearTimers])

  const handleTouchEnd = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }
  }, [])

  const handleTouchCancel = useCallback(() => {
    clearTimers()
    setLongPressVisible(false)
  }, [clearTimers])

  return (
    <span
      className="relative inline-flex"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <TooltipPrimitive delayDuration={delayDuration} open={open} onOpenChange={onOpenChange}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          hidden={hidden}
          className={contentClassName}
          arrowClassName={arrowClassName}
        >
          <span>{message}</span>
        </TooltipContent>
      </TooltipPrimitive>

      {longPressVisible && <TouchTooltipBubble message={message} side={side} />}
    </span>
  )
}
