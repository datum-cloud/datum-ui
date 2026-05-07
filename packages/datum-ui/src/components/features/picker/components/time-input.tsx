import { Button } from '@repo/shadcn/ui/button'
import { Clock } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../../../utils/cn'
import { OptionList, useOptionPicker } from '../../../base/option-picker'
import { ResponsivePopover } from '../../../base/responsive-popover'
import { useTimeSlots } from '../hooks/use-time-slots'
import { dateToHHmm, formatTimeLabel, parseTimeString } from '../utils/format'
import { isoToZonedDate, zonedDateToIso } from '../utils/timezone'
import { usePickerContext } from './context'

type Target
  = | 'single'
    | 'range-from'
    | 'range-to'
    | 'embedded-from'
    | 'embedded-to'

interface PickerTimeInputProps {
  target: Target
  min?: string
  max?: string
  className?: string
}

function combineDateAndTime(dateIso: string, time: string, timezone: string): string {
  const d = isoToZonedDate(dateIso, timezone)
  const parsed = parseTimeString(time)
  if (!parsed)
    return dateIso
  d.setHours(parsed.h, parsed.m, 0, 0)
  return zonedDateToIso(d, timezone)
}

export function PickerTimeInput({ target, min, max, className }: PickerTimeInputProps) {
  const { mode, timezone, hourCycle, step, state, actions } = usePickerContext()

  // In time-range mode, the "to" slot list cannot offer times earlier than the
  // currently selected "from" — clamp the effective min so users can't construct
  // an inverted range from the dropdown.
  let effectiveMin = min
  if (target === 'range-to' && mode === 'time-range') {
    const v = state.pendingValue as { from: string, to: string } | null
    const fromValue = v?.from
    if (fromValue) {
      effectiveMin = min && min > fromValue ? min : fromValue
    }
  }

  const slots = useTimeSlots({ min: effectiveMin, max, step, hourCycle })

  let currentValue: string | undefined
  // Embedded time slots in datetime modes can't be edited until a date is
  // chosen — they have nothing to attach the time to.
  let embeddedDisabled = false
  if (target === 'single' && mode === 'time') {
    currentValue = (state.pendingValue as string | null) ?? undefined
  }
  else if ((target === 'range-from' || target === 'range-to') && mode === 'time-range') {
    const v = state.pendingValue as { from: string, to: string } | null
    currentValue = target === 'range-from' ? v?.from : v?.to
  }
  else if (target === 'embedded-from' || target === 'embedded-to') {
    if (mode === 'datetime-range' || mode === 'date-range-time') {
      const v = state.pendingValue as { from: string, to: string } | null
      const iso = target === 'embedded-from' ? v?.from : v?.to
      currentValue = iso ? dateToHHmm(isoToZonedDate(iso, timezone)) : undefined
      embeddedDisabled = v === null
    }
    else if (mode === 'datetime') {
      const iso = state.pendingValue as string | null
      currentValue = iso ? dateToHHmm(isoToZonedDate(iso, timezone)) : undefined
      embeddedDisabled = iso === null
    }
  }

  const handleSelect = (newTime: string) => {
    if (target === 'single' && mode === 'time') {
      actions.setSingleTime(newTime)
      return
    }
    if (mode === 'time-range') {
      const v = (state.pendingValue as { from: string, to: string } | null) ?? { from: '00:00', to: '23:59' }
      const next = target === 'range-from' ? { from: newTime, to: v.to } : { from: v.from, to: newTime }
      actions.setTimeRange(next)
      return
    }
    if (mode === 'datetime-range' || mode === 'date-range-time') {
      const v = state.pendingValue as { from: string, to: string } | null
      if (!v)
        return
      const next = target === 'embedded-from'
        ? { from: combineDateAndTime(v.from, newTime, timezone), to: v.to }
        : { from: v.from, to: combineDateAndTime(v.to, newTime, timezone) }
      actions.setDatetimeRange(next)
      return
    }
    if (mode === 'datetime' && (target === 'embedded-from' || target === 'embedded-to')) {
      const v = state.pendingValue as string | null
      if (!v)
        return
      actions.setSingleDatetime(combineDateAndTime(v, newTime, timezone))
    }
  }

  if (target === 'single' || target === 'range-from' || target === 'range-to') {
    return (
      <InlineSlotList
        slots={slots}
        value={currentValue}
        onSelect={handleSelect}
        className={className}
      />
    )
  }

  return (
    <EmbeddedSlotInput
      label={currentValue ? formatTimeLabel(currentValue, hourCycle) : '— : —'}
      slots={slots}
      value={currentValue}
      onSelect={handleSelect}
      disabled={embeddedDisabled}
      className={className}
    />
  )
}

PickerTimeInput.displayName = 'Picker.TimeInput'

interface SlotListProps {
  slots: ReturnType<typeof useTimeSlots>
  value?: string
  onSelect: (value: string) => void
  className?: string
}

function InlineSlotList({ slots, value, onSelect, className }: SlotListProps) {
  const [open, setOpen] = useState(true)
  const picker = useOptionPicker({
    multiple: false,
    options: slots,
    value,
    onValueChange: (next) => {
      if (typeof next === 'string')
        onSelect(next)
    },
    open,
    onOpenChange: setOpen,
  })
  return (
    <OptionList
      picker={picker}
      disableSearch={slots.length <= 48}
      searchPlaceholder="Search time..."
      listClassName={cn('max-h-[240px]', className)}
    />
  )
}

function EmbeddedSlotInput({
  label,
  slots,
  value,
  onSelect,
  disabled = false,
  className,
}: SlotListProps & { label: string, disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const picker = useOptionPicker({
    multiple: false,
    options: slots,
    value,
    onValueChange: (next) => {
      if (typeof next === 'string') {
        onSelect(next)
        setOpen(false)
      }
    },
    open,
    onOpenChange: disabled ? () => {} : setOpen,
  })
  return (
    <ResponsivePopover
      open={open}
      onOpenChange={disabled ? () => {} : setOpen}
      sheetTitle="Select time"
      trigger={(
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn('h-8 gap-1.5 px-2 text-xs font-normal', className)}
        >
          <Clock className="size-3.5 opacity-60" />
          <span>{label}</span>
        </Button>
      )}
      align="start"
      contentClassName="w-[200px]"
    >
      <OptionList
        picker={picker}
        disableSearch={slots.length <= 48}
        searchPlaceholder="Search time..."
        listClassName="max-h-[240px]"
      />
    </ResponsivePopover>
  )
}
