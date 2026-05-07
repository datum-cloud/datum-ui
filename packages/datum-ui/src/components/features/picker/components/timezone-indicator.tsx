import { Globe } from 'lucide-react'
import { cn } from '../../../../utils/cn'
import { isTimeBearingMode } from '../types'
import { formatTimezoneLabel } from '../utils/timezone'
import { usePickerContext } from './context'

interface PickerTimezoneIndicatorProps {
  className?: string
  /**
   * `'full'` (default) renders "Times shown in <TZ>" with a globe icon.
   * `'compact'` renders just the bare timezone identifier (no prefix or icon).
   */
  variant?: 'full' | 'compact'
}

export function PickerTimezoneIndicator({
  className,
  variant = 'full',
}: PickerTimezoneIndicatorProps) {
  const { mode, timezone, hideTimezone } = usePickerContext()

  if (hideTimezone)
    return null
  if (!isTimeBearingMode(mode))
    return null

  if (variant === 'compact') {
    return (
      <span
        data-slot="picker-tz-indicator"
        className={cn('text-muted-foreground text-xs', className)}
      >
        {timezone}
      </span>
    )
  }

  return (
    <div
      data-slot="picker-tz-indicator"
      className={cn(
        'text-muted-foreground bg-muted/30 flex items-center gap-2 px-3 py-2 text-xs',
        className,
      )}
    >
      <Globe className="size-3.5" />
      <span>
        Times shown in
        {' '}
        {formatTimezoneLabel(timezone)}
      </span>
    </div>
  )
}
PickerTimezoneIndicator.displayName = 'Picker.TimezoneIndicator'
