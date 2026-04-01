import type { DateTimePickerProps, DateTimeState } from './types'
import { Button } from '@repo/shadcn/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/shadcn/ui/popover'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { Calendar } from '../../base/calendar/calendar'
import { formatDate } from './utils/format'
import {
  getBrowserTimezone,
  localDateTimeToUtc,
  utcToLocalDateTime,
} from './utils/timezone'

const DEFAULT_TIMEZONE = getBrowserTimezone()

export function DateTimePicker({ ref, value, onChange, minDate, maxDate, disabledDates, timezone = DEFAULT_TIMEZONE, showTimezoneIndicator = false, placeholder = 'Select date and time', disabled = false, className }: DateTimePickerProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  // Derive initial state from value prop
  const initialState = React.useMemo<DateTimeState>(() => {
    if (!value) {
      return { date: undefined, time: '' }
    }
    return utcToLocalDateTime(value, timezone)
  }, [value, timezone])

  // Track local state
  const [state, setState] = React.useState<DateTimeState>(initialState)

  // Sync with external value changes
  const prevValue = React.useRef(value)
  const prevTimezone = React.useRef(timezone)

  React.useEffect(() => {
    if (value !== prevValue.current || timezone !== prevTimezone.current) {
      prevValue.current = value
      prevTimezone.current = timezone
      // Using functional update to avoid direct setState call
      setState(() => value ? utcToLocalDateTime(value, timezone) : { date: undefined, time: '' })
    }
  }, [value, timezone])

  // Handle date change
  const handleDateChange = React.useCallback((newDate: Date | undefined) => {
    setState(prev => ({ ...prev, date: newDate }))
  }, [])

  // Handle time change
  const handleTimeChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value

    // Validate HH:mm format
    if (newTime && !/^\d{2}:\d{2}$/.test(newTime))
      return

    setState(prev => ({ ...prev, time: newTime }))
  }, [])

  // Emit UTC value when both date and time are set
  React.useEffect(() => {
    if (state.date && state.time) {
      const utcValue = localDateTimeToUtc(state.date, state.time, timezone)
      onChange?.(utcValue)
    }
  }, [state.date, state.time, timezone, onChange])

  // Format display value (date + time if both are set)
  const formatDisplayValue = () => {
    if (!state.date)
      return placeholder
    if (state.time) {
      return `${formatDate(state.date)} ${state.time}`
    }
    return formatDate(state.date)
  }

  return (
    <div ref={ref} className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !state.date && 'text-muted-foreground',
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="flex-1">{formatDisplayValue()}</span>
            {showTimezoneIndicator && state.date && state.time && (
              <span className="text-muted-foreground ml-2 text-xs">
                {timezone}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <Calendar
              mode="single"
              selected={state.date}
              onSelect={handleDateChange}
              disabled={disabledDates}
              fromDate={minDate}
              toDate={maxDate}
            />

            {/* Time Input inside popover */}
            <div className="mt-3">
              <label className="mb-1 block text-sm font-medium">Time</label>
              <input
                type="time"
                aria-label="Select time"
                value={state.time}
                onChange={handleTimeChange}
                disabled={disabled || !state.date}
                className={cn(
                  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1',
                  'text-sm shadow-sm transition-colors',
                  'placeholder:text-muted-foreground',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

DateTimePicker.displayName = 'DateTimePicker'
