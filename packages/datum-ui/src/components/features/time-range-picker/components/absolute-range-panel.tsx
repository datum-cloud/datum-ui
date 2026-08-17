import { endOfDay, format, startOfDay } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Button, Calendar, Input } from '../../..'
import { cn } from '../../../../utils/cn'
import { ResponsivePopover } from '../../../base/responsive-popover'
// app/modules/datum-ui/components/time-range-picker/components/absolute-range-panel.tsx
import { utcStringToZonedDate, zonedDateToUtcString } from '../utils/timezone'

interface CustomRangePanelProps {
  /** Start time in UTC ISO format */
  fromUtc: string
  /** End time in UTC ISO format */
  toUtc: string
  /** User's timezone for display */
  timezone: string
  /** Called when range changes (with UTC values) */
  onRangeChange: (from: string, to: string) => void
  /** Disable future dates */
  disableFuture?: boolean
  /** Debounce delay for time inputs in ms */
  debounceMs?: number
  className?: string
}

/**
 * Parse a zoned date into separate date and time parts
 */
function parseDateTimeParts(zonedDate: Date): { date: Date, time: string } {
  const hours = zonedDate.getHours().toString().padStart(2, '0')
  const minutes = zonedDate.getMinutes().toString().padStart(2, '0')
  return {
    date: zonedDate,
    time: `${hours}:${minutes}`,
  }
}

/**
 * Parse a (possibly malformed/empty) UTC string into zoned date+time parts,
 * degrading to the current instant instead of producing an Invalid Date that
 * would crash `format()` during render (BUG-145).
 */
function safeParseDateTimeParts(utc: string, timezone: string): { date: Date, time: string } {
  try {
    const zoned = utcStringToZonedDate(utc, timezone)
    if (!Number.isNaN(zoned.getTime()))
      return parseDateTimeParts(zoned)
  }
  catch {
    // fall through to the safe default below
  }
  return parseDateTimeParts(utcStringToZonedDate(new Date().toISOString(), timezone))
}

/** Format a date for the trigger label, tolerating an Invalid Date. */
function safeFormatDay(date: Date): string {
  return Number.isNaN(date.getTime()) ? '—' : format(date, 'MMM d, yyyy')
}

/**
 * Combine a date and time string into a single Date
 */
function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number)
  const combined = new Date(date)
  combined.setHours(hours || 0, minutes || 0, 0, 0)
  return combined
}

/**
 * Validate time string format (HH:mm)
 */
function isValidTime(time: string): boolean {
  const match = time.match(/^(\d{2}):(\d{2})$/)
  if (!match)
    return false
  const hours = Number.parseInt(match[1]!, 10)
  const minutes = Number.parseInt(match[2]!, 10)
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
}

export function CustomRangePanel({
  fromUtc,
  toUtc,
  timezone,
  onRangeChange,
  disableFuture = false,
  debounceMs = 600,
  className,
}: CustomRangePanelProps) {
  const startDateId = useId()
  const startTimeId = useId()
  const endDateId = useId()
  const endTimeId = useId()

  // Track if user has manually edited the time inputs
  const userHasEditedTimeRef = useRef(false)

  // Track previous prop values to detect external changes
  const prevFromUtcRef = useRef(fromUtc)
  const prevToUtcRef = useRef(toUtc)
  const prevTimezoneRef = useRef(timezone)

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Popover open states
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  // Local state for date and time (in user's timezone). Parsed lazily (once)
  // via safe initializers so a malformed prop can't crash render (BUG-145) and
  // the parse doesn't re-run on every render (BUG-036).
  const [startDate, setStartDate] = useState<Date>(() => safeParseDateTimeParts(fromUtc, timezone).date)
  const [startTime, setStartTime] = useState<string>(() => safeParseDateTimeParts(fromUtc, timezone).time)
  const [endDate, setEndDate] = useState<Date>(() => safeParseDateTimeParts(toUtc, timezone).date)
  const [endTime, setEndTime] = useState<string>(() => safeParseDateTimeParts(toUtc, timezone).time)

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Update local state when UTC props OR the display timezone change (from an
  // external source like preset selection or a TimezoneSelector). A
  // timezone-only change must re-derive the wall-clock date/time too (BUG-036).
  useEffect(() => {
    const tzChanged = timezone !== prevTimezoneRef.current
    const fromChanged = fromUtc !== prevFromUtcRef.current
    const toChanged = toUtc !== prevToUtcRef.current

    if (fromChanged || tzChanged) {
      const parsed = safeParseDateTimeParts(fromUtc, timezone)
      setStartDate(parsed.date)
      setStartTime(parsed.time)
      userHasEditedTimeRef.current = false
      prevFromUtcRef.current = fromUtc
    }

    if (toChanged || tzChanged) {
      const parsed = safeParseDateTimeParts(toUtc, timezone)
      setEndDate(parsed.date)
      setEndTime(parsed.time)
      userHasEditedTimeRef.current = false
      prevToUtcRef.current = toUtc
    }

    prevTimezoneRef.current = timezone
  }, [fromUtc, toUtc, timezone])

  // Notify parent when values change (immediate, no debounce)
  const notifyChangeImmediate = useCallback(
    (newStartDate: Date, newStartTime: string, newEndDate: Date, newEndTime: string) => {
      if (!isValidTime(newStartTime) || !isValidTime(newEndTime))
        return

      const startCombined = combineDateAndTime(newStartDate, newStartTime)
      const endCombined = combineDateAndTime(newEndDate, newEndTime)

      // Validate: start must be before end
      if (startCombined >= endCombined)
        return

      const newFromUtc = zonedDateToUtcString(startCombined, timezone)
      const newToUtc = zonedDateToUtcString(endCombined, timezone)

      // Only call if actually changed
      if (newFromUtc !== fromUtc || newToUtc !== toUtc) {
        onRangeChange(newFromUtc, newToUtc)
      }
    },
    [timezone, fromUtc, toUtc, onRangeChange],
  )

  // Notify parent when values change (debounced for time inputs)
  const notifyChangeDebounced = useCallback(
    (newStartDate: Date, newStartTime: string, newEndDate: Date, newEndTime: string) => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Set new debounced timer
      debounceTimerRef.current = setTimeout(() => {
        notifyChangeImmediate(newStartDate, newStartTime, newEndDate, newEndTime)
      }, debounceMs)
    },
    [notifyChangeImmediate, debounceMs],
  )

  // Cancel any pending debounced time-input update so it can't fire later with
  // stale captured values and revert an immediate date selection (BUG-144).
  const cancelPendingDebounce = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
  }, [])

  // Handlers for start date (immediate)
  const handleStartDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date)
        return
      cancelPendingDebounce()
      setStartDate(date)
      setStartDateOpen(false)
      notifyChangeImmediate(date, startTime, endDate, endTime)
    },
    [startTime, endDate, endTime, notifyChangeImmediate, cancelPendingDebounce],
  )

  // Handlers for start time (debounced)
  const handleStartTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = e.target.value
      userHasEditedTimeRef.current = true
      setStartTime(newTime)
      if (isValidTime(newTime)) {
        notifyChangeDebounced(startDate, newTime, endDate, endTime)
      }
    },
    [startDate, endDate, endTime, notifyChangeDebounced],
  )

  // Handlers for end date (immediate)
  const handleEndDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date)
        return
      cancelPendingDebounce()
      setEndDate(date)
      setEndDateOpen(false)
      notifyChangeImmediate(startDate, startTime, date, endTime)
    },
    [startDate, startTime, endTime, notifyChangeImmediate, cancelPendingDebounce],
  )

  // Handlers for end time (debounced)
  const handleEndTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = e.target.value
      userHasEditedTimeRef.current = true
      setEndTime(newTime)
      if (isValidTime(newTime)) {
        notifyChangeDebounced(startDate, startTime, endDate, newTime)
      }
    },
    [startDate, startTime, endDate, notifyChangeDebounced],
  )

  // "Today" as seen in the display timezone — future-day disabling must be
  // relative to the display tz, not the browser's local day (BUG-079).
  const endOfTodayInTz = endOfDay(utcStringToZonedDate(new Date().toISOString(), timezone))
  const isFutureDay = (date: Date): boolean => date > endOfTodayInTz
  // The end date must be on or after the start day (compare whole days so a
  // same-day range is selectable — the start day itself must NOT be disabled).
  const startDay = startOfDay(startDate)
  const isBeforeStartDay = (date: Date): boolean => date < startDay

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p className="text-muted-foreground text-xs font-medium">Custom Range</p>

      {/* Start / End date+time — stacked on mobile, inline on desktop */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Start Date + Time */}
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground w-10 shrink-0 text-xs sm:hidden">From</span>
          <ResponsivePopover
            open={startDateOpen}
            onOpenChange={setStartDateOpen}
            sheetTitle="Select start date"
            align="start"
            contentClassName="w-auto"
            trigger={(
              <Button
                type="quaternary"
                theme="outline"
                id={startDateId}
                className="h-8 min-w-0 flex-1 justify-start gap-1.5 px-2 text-xs font-normal sm:w-full sm:flex-initial"
              >
                <CalendarIcon className="h-3.5 w-3.5 shrink-0 opacity-50" />
                <span className="truncate">{safeFormatDay(startDate)}</span>
              </Button>
            )}
          >
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartDateSelect}
              disabled={disableFuture ? isFutureDay : undefined}
              autoFocus
            />
          </ResponsivePopover>

          <Input
            type="time"
            id={startTimeId}
            value={startTime}
            onChange={handleStartTimeChange}
            className={cn(
              'h-8 w-[80px] px-2 text-xs md:text-xs',
              'appearance-none bg-transparent',
              '[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none',
            )}
          />
        </div>

        {/* Separator — hidden on mobile (label replaces it) */}
        <span className="text-muted-foreground hidden text-sm sm:block">—</span>

        {/* End Date + Time */}
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground w-10 shrink-0 text-xs sm:hidden">To</span>
          <ResponsivePopover
            open={endDateOpen}
            onOpenChange={setEndDateOpen}
            sheetTitle="Select end date"
            align="start"
            contentClassName="w-auto"
            trigger={(
              <Button
                type="quaternary"
                theme="outline"
                id={endDateId}
                className="h-8 min-w-0 flex-1 justify-start gap-1.5 px-2 text-xs font-normal sm:w-full sm:flex-initial"
              >
                <CalendarIcon className="h-3.5 w-3.5 shrink-0 opacity-50" />
                <span className="truncate">{safeFormatDay(endDate)}</span>
              </Button>
            )}
          >
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndDateSelect}
              disabled={
                disableFuture
                  ? (date: Date) => isFutureDay(date) || isBeforeStartDay(date)
                  : isBeforeStartDay
              }
              autoFocus
            />
          </ResponsivePopover>

          <Input
            type="time"
            id={endTimeId}
            value={endTime}
            onChange={handleEndTimeChange}
            className={cn(
              'h-8 w-[80px] px-2 text-xs md:text-xs',
              'appearance-none bg-transparent',
              '[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none',
            )}
          />
        </div>
      </div>
    </div>
  )
}

// Keep the old name for backward compatibility during refactor
export { CustomRangePanel as AbsoluteRangePanel }
