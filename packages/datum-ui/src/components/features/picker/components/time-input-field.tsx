import { useEffect, useState } from 'react'
import { cn } from '../../../../utils/cn'
import { parseTimeString } from '../utils/format'
import { isoToZonedDate, zonedDateToIso } from '../utils/timezone'
import { usePickerContext } from './context'

interface PickerTimeInputFieldProps {
  className?: string
  /** ARIA label for the input. Default `"Select time"`. */
  ariaLabel?: string
  /** id forwarded to the input element. */
  id?: string
}

function formatZonedTimeOfDay(iso: string, tz: string): string {
  try {
    const d = isoToZonedDate(iso, tz)
    if (Number.isNaN(d.getTime()))
      return ''
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }
  catch {
    return ''
  }
}

export function PickerTimeInputField({
  className,
  ariaLabel = 'Select time',
  id,
}: PickerTimeInputFieldProps) {
  const { mode, timezone, state, actions } = usePickerContext()

  const isoValue = mode === 'datetime' ? (state.pendingValue as string | null) : null
  const externalTimeValue = isoValue ? formatZonedTimeOfDay(isoValue, timezone) : ''

  const [localValue, setLocalValue] = useState(externalTimeValue)

  useEffect(() => {
    setLocalValue(externalTimeValue)
  }, [externalTimeValue])

  if (mode !== 'datetime')
    return null

  const disabled = isoValue === null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    setLocalValue(next)
    if (!isoValue)
      return
    const parsed = parseTimeString(next)
    if (!parsed)
      return
    const d = isoToZonedDate(isoValue, timezone)
    d.setHours(parsed.h, parsed.m, 0, 0)
    actions.setSingleDatetime(zonedDateToIso(d, timezone))
  }

  return (
    <input
      type="text"
      id={id}
      aria-label={ariaLabel}
      value={localValue}
      onChange={handleChange}
      disabled={disabled}
      className={cn(
        'border-input-border bg-input-background/50 h-10 w-full rounded-lg border px-3 text-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    />
  )
}

PickerTimeInputField.displayName = 'Picker.TimeInputField'
