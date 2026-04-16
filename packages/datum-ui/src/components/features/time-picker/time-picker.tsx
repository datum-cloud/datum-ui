import type { TimePickerProps } from './types'
import { Clock } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { OptionList, useOptionPicker } from '../../base/option-picker'
import { ResponsivePopover } from '../../base/responsive-popover'
import { formatTimeLabel, useTimeSlots } from './use-time-slots'

export function TimePicker({
  value,
  onChange,
  min,
  max,
  step = 15,
  placeholder = 'Select time',
  disabled = false,
  className,
  id,
  name,
  responsive = true,
  sheetTitle,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const slots = useTimeSlots({ min, max, step })

  const picker = useOptionPicker({
    multiple: false,
    options: slots,
    value,
    onValueChange: onChange,
    open,
    onOpenChange: setOpen,
  })

  const displayValue = value ? formatTimeLabel(value) : undefined

  const trigger = (
    <button
      type="button"
      id={id}
      role="combobox"
      aria-expanded={open}
      disabled={disabled}
      className={cn(
        'text-input-foreground placeholder:text-input-placeholder',
        'border-input-border bg-input-background/50 relative flex h-10 w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-all',
        'focus-visible:border-input-focus-border focus-visible:shadow-(--input-focus-shadow)',
        'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-hidden',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <span className={cn(!displayValue && 'text-muted-foreground')}>
        {displayValue ?? placeholder}
      </span>
      <Clock className="text-muted-foreground ml-2 size-4 shrink-0" />
    </button>
  )

  return (
    <>
      <ResponsivePopover
        open={open}
        onOpenChange={setOpen}
        responsive={responsive}
        sheetTitle={sheetTitle ?? placeholder}
        trigger={trigger}
        align="start"
      >
        <OptionList
          picker={picker}
          disableSearch={slots.length <= 48}
          searchPlaceholder="Search time..."
          listClassName="max-h-[200px]"
        />
      </ResponsivePopover>
      {name && <input type="hidden" name={name} value={value ?? ''} readOnly />}
    </>
  )
}

TimePicker.displayName = 'TimePicker'
