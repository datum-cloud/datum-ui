import type { DateRange } from 'react-day-picker'
import type { CalendarDatePickerProps, DateRangePreset } from './types'
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from 'date-fns'
import { formatInTimeZone, toDate } from 'date-fns-tz'
import * as React from 'react'
import { useDateConstraints } from '../../base/date-picker'

export interface UseCalendarDatePickerReturn {
  // State
  isPopoverOpen: boolean
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedRange: string | null
  setSelectedRange: React.Dispatch<React.SetStateAction<string | null>>
  monthFrom: Date | undefined
  setMonthFrom: React.Dispatch<React.SetStateAction<Date | undefined>>
  yearFrom: number | undefined
  setYearFrom: React.Dispatch<React.SetStateAction<number | undefined>>
  monthTo: Date | undefined
  setMonthTo: React.Dispatch<React.SetStateAction<Date | undefined>>
  yearTo: number | undefined
  setYearTo: React.Dispatch<React.SetStateAction<number | undefined>>
  highlightedPart: string | null
  pendingDate: DateRange
  // Computed values
  timeZone: string
  today: Date
  effectiveMinDate: Date | undefined
  effectiveMaxDate: Date | undefined
  years: number[]
  dateRanges: DateRangePreset[]
  // Callbacks
  isDateDisabled: (date: Date) => boolean
  getDaysDifference: (from: Date, to: Date) => number
  isRangeValid: (from: Date, to: Date) => boolean
  adjustRangeToMaxRange: (from: Date, to: Date) => { from: Date, to: Date }
  handleTogglePopover: () => void
  handleClear: (e: React.MouseEvent) => void
  handleApply: () => void
  handleReset: () => void
  selectDateRange: (from: Date, to: Date, range: string) => void
  handleDateSelect: (range: DateRange | undefined) => void
  handleMonthChange: (newMonthIndex: number, part: string) => void
  handleYearChange: (newYear: number, part: string) => void
  handleMouseOver: (part: string) => void
  handleMouseLeave: () => void
  handleWheel: (event: React.WheelEvent) => void
  formatWithTz: (date: Date, fmt: string) => string
}

export function useCalendarDatePicker(
  props: CalendarDatePickerProps & { id?: string },
): UseCalendarDatePickerReturn {
  const {
    id = 'calendar-date-picker',
    date,
    closeOnSelect = false,
    numberOfMonths = 2,
    yearsRange = 10,
    onDateSelect,
    excludePresets,
    customPresets,
    minDate,
    maxDate,
    disableFuture = false,
    disablePast = false,
    maxRange,
  } = props

  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [selectedRange, setSelectedRange] = React.useState<string | null>(
    numberOfMonths === 2 ? 'This Year' : 'Today',
  )
  const [monthFrom, setMonthFrom] = React.useState<Date | undefined>(date?.from)
  const [yearFrom, setYearFrom] = React.useState<number | undefined>(date?.from?.getFullYear())
  const [monthTo, setMonthTo] = React.useState<Date | undefined>(
    numberOfMonths === 2 ? date?.to : date?.from,
  )
  const [yearTo, setYearTo] = React.useState<number | undefined>(
    numberOfMonths === 2 ? date?.to?.getFullYear() : date?.from?.getFullYear(),
  )
  const [highlightedPart, setHighlightedPart] = React.useState<string | null>(null)

  // Temporary state for pending changes (until Apply is clicked)
  const [pendingDate, setPendingDate] = React.useState<DateRange>(date)

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const today = new Date()

  // Calculate date constraints
  const { effectiveMinDate, effectiveMaxDate, isDateDisabled } = useDateConstraints({
    minDate,
    maxDate,
    disablePast,
    disableFuture,
  })

  // Calculate the number of days between two dates
  const getDaysDifference = React.useCallback((from: Date, to: Date): number => {
    const timeDiff = Math.abs(to.getTime() - from.getTime())
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
  }, [])

  // Validate if a date range exceeds the maximum allowed range
  const isRangeValid = React.useCallback(
    (from: Date, to: Date): boolean => {
      if (!maxRange)
        return true
      if (numberOfMonths === 1)
        return true // Single date picker always valid
      return getDaysDifference(from, to) <= maxRange
    },
    [maxRange, numberOfMonths, getDaysDifference],
  )

  // Auto-adjust date range to fit within maxRange
  const adjustRangeToMaxRange = React.useCallback(
    (from: Date, to: Date): { from: Date, to: Date } => {
      if (!maxRange || numberOfMonths === 1)
        return { from, to }

      const daysDiff = getDaysDifference(from, to)
      if (daysDiff <= maxRange)
        return { from, to }

      // Adjust the 'to' date to be within maxRange from 'from' date
      const adjustedTo = new Date(from.getTime() + maxRange * 24 * 60 * 60 * 1000)

      // Make sure the adjusted date doesn't exceed effectiveMaxDate
      if (effectiveMaxDate && adjustedTo > effectiveMaxDate) {
        // If adjusting 'to' would exceed maxDate, try adjusting 'from' instead
        const adjustedFrom = new Date(to.getTime() - maxRange * 24 * 60 * 60 * 1000)

        // Make sure the adjusted 'from' doesn't go below effectiveMinDate
        if (effectiveMinDate && adjustedFrom < effectiveMinDate) {
          // If both adjustments fail, keep original dates (validation will catch this)
          return { from, to }
        }

        return { from: adjustedFrom, to }
      }

      return { from, to: adjustedTo }
    },
    [maxRange, numberOfMonths, getDaysDifference, effectiveMinDate, effectiveMaxDate],
  )

  // Sync pendingDate with date prop changes
  React.useEffect(() => {
    setPendingDate(date)
  }, [date])

  const handleTogglePopover = () => setIsPopoverOpen(prev => !prev)

  // Clear the date selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDateSelect(undefined)
    setPendingDate({ from: undefined, to: undefined })
    setSelectedRange(null)
  }

  // Apply the pending changes
  const handleApply = () => {
    if (pendingDate?.from) {
      onDateSelect({
        from: pendingDate.from,
        to: pendingDate.to || pendingDate.from,
      })
    }
    setIsPopoverOpen(false)
  }

  // Reset to the original date
  const handleReset = () => {
    setPendingDate(date)
    setMonthFrom(date?.from)
    setYearFrom(date?.from?.getFullYear())
    setMonthTo(numberOfMonths === 2 ? date?.to : date?.from)
    setYearTo(numberOfMonths === 2 ? date?.to?.getFullYear() : date?.from?.getFullYear())
    setSelectedRange(null)
  }

  const selectDateRange = (from: Date, to: Date, range: string) => {
    const startDate = startOfDay(toDate(from, { timeZone }))
    const endDate = numberOfMonths === 2 ? endOfDay(toDate(to, { timeZone })) : startDate

    // Validate date constraints
    if (isDateDisabled(startDate) || isDateDisabled(endDate)) {
      return // Don't select if dates are disabled
    }

    // Validate and adjust range if necessary
    let finalDates = { from: startDate, to: endDate }
    if (numberOfMonths === 2 && !isRangeValid(startDate, endDate)) {
      finalDates = adjustRangeToMaxRange(startDate, endDate)

      // If adjustment still results in invalid range, don't select
      if (!isRangeValid(finalDates.from, finalDates.to)) {
        return
      }
    }

    setPendingDate({ from: finalDates.from, to: finalDates.to })
    setSelectedRange(range)
    setMonthFrom(finalDates.from)
    setYearFrom(finalDates.from.getFullYear())
    setMonthTo(finalDates.to)
    setYearTo(finalDates.to.getFullYear())
    if (closeOnSelect) {
      onDateSelect({ from: finalDates.from, to: finalDates.to })
      setIsPopoverOpen(false)
    }
  }

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range) {
      let from = startOfDay(toDate(range.from as Date, { timeZone }))
      let to = range.to ? endOfDay(toDate(range.to, { timeZone })) : from
      if (numberOfMonths === 1) {
        if (range.from !== pendingDate?.from) {
          to = from
        }
        else {
          from = startOfDay(toDate(range.to as Date, { timeZone }))
        }
      }

      // Validate date constraints
      if (isDateDisabled(from) || isDateDisabled(to)) {
        return // Don't select if dates are disabled
      }

      // Validate and adjust range if necessary
      let finalDates = { from, to }
      if (numberOfMonths === 2 && !isRangeValid(from, to)) {
        finalDates = adjustRangeToMaxRange(from, to)

        // If adjustment still results in invalid range, don't select
        if (!isRangeValid(finalDates.from, finalDates.to)) {
          return
        }
      }

      setPendingDate({ from: finalDates.from, to: finalDates.to })
      setMonthFrom(finalDates.from)
      setYearFrom(finalDates.from.getFullYear())
      setMonthTo(finalDates.to)
      setYearTo(finalDates.to.getFullYear())

      if (closeOnSelect) {
        onDateSelect({ from: finalDates.from, to: finalDates.to })
        setIsPopoverOpen(false)
      }
    }
    setSelectedRange(null)
  }

  const handleMonthChange = (newMonthIndex: number, part: string) => {
    setSelectedRange(null)
    if (part === 'from') {
      if (yearFrom !== undefined) {
        if (newMonthIndex < 0 || newMonthIndex > yearsRange + 1)
          return
        const newMonth = new Date(yearFrom, newMonthIndex, 1)
        const from
          = numberOfMonths === 2
            ? startOfMonth(toDate(newMonth, { timeZone }))
            : pendingDate?.from
              ? new Date(
                  pendingDate.from.getFullYear(),
                  newMonth.getMonth(),
                  pendingDate.from.getDate(),
                )
              : newMonth
        const to
          = numberOfMonths === 2
            ? pendingDate?.to
              ? endOfDay(toDate(pendingDate.to, { timeZone }))
              : endOfMonth(toDate(newMonth, { timeZone }))
            : from
        if (from <= to) {
          setPendingDate({ from, to })
          setMonthFrom(newMonth)
          setMonthTo(pendingDate?.to)
        }
      }
    }
    else {
      if (yearTo !== undefined) {
        if (newMonthIndex < 0 || newMonthIndex > yearsRange + 1)
          return
        const newMonth = new Date(yearTo, newMonthIndex, 1)
        const from = pendingDate?.from
          ? startOfDay(toDate(pendingDate.from, { timeZone }))
          : startOfMonth(toDate(newMonth, { timeZone }))
        const to = numberOfMonths === 2 ? endOfMonth(toDate(newMonth, { timeZone })) : from
        if (from <= to) {
          setPendingDate({ from, to })
          setMonthTo(newMonth)
          setMonthFrom(pendingDate?.from)
        }
      }
    }
  }

  const years = Array.from(
    { length: yearsRange + 1 },
    (_, i) => today.getFullYear() - yearsRange / 2 + i,
  )

  const handleYearChange = (newYear: number, part: string) => {
    setSelectedRange(null)
    if (part === 'from') {
      if (years.includes(newYear)) {
        const newMonth = monthFrom
          ? new Date(newYear, monthFrom ? monthFrom.getMonth() : 0, 1)
          : new Date(newYear, 0, 1)
        const from
          = numberOfMonths === 2
            ? startOfMonth(toDate(newMonth, { timeZone }))
            : pendingDate?.from
              ? new Date(newYear, newMonth.getMonth(), pendingDate.from.getDate())
              : newMonth
        const to
          = numberOfMonths === 2
            ? pendingDate?.to
              ? endOfDay(toDate(pendingDate.to, { timeZone }))
              : endOfMonth(toDate(newMonth, { timeZone }))
            : from
        if (from <= to) {
          setPendingDate({ from, to })
          setYearFrom(newYear)
          setMonthFrom(newMonth)
          setYearTo(pendingDate?.to?.getFullYear())
          setMonthTo(pendingDate?.to)
        }
      }
    }
    else {
      if (years.includes(newYear)) {
        const newMonth = monthTo
          ? new Date(newYear, monthTo.getMonth(), 1)
          : new Date(newYear, 0, 1)
        const from = pendingDate?.from
          ? startOfDay(toDate(pendingDate.from, { timeZone }))
          : startOfMonth(toDate(newMonth, { timeZone }))
        const to = numberOfMonths === 2 ? endOfMonth(toDate(newMonth, { timeZone })) : from
        if (from <= to) {
          setPendingDate({ from, to })
          setYearTo(newYear)
          setMonthTo(newMonth)
          setYearFrom(pendingDate?.from?.getFullYear())
          setMonthFrom(pendingDate?.from)
        }
      }
    }
  }

  // Default date range presets
  const defaultDateRangePresets: DateRangePreset[] = [
    { key: 'today', label: 'Today', start: today, end: today },
    { key: 'yesterday', label: 'Yesterday', start: subDays(today, 1), end: subDays(today, 1) },
    {
      key: 'thisWeek',
      label: 'This Week',
      start: startOfWeek(today, { weekStartsOn: 1 }),
      end: endOfWeek(today, { weekStartsOn: 1 }),
    },
    {
      key: 'lastWeek',
      label: 'Last Week',
      start: subDays(startOfWeek(today, { weekStartsOn: 1 }), 7),
      end: subDays(endOfWeek(today, { weekStartsOn: 1 }), 7),
    },
    {
      key: 'last7Days',
      label: 'Last 7 Days',
      start: subDays(today, 6),
      end: today,
    },
    {
      key: 'thisMonth',
      label: 'This Month',
      start: startOfMonth(today),
      end: endOfMonth(today),
    },
    {
      key: 'lastMonth',
      label: 'Last Month',
      start: startOfMonth(subDays(today, today.getDate())),
      end: endOfMonth(subDays(today, today.getDate())),
    },
    {
      key: 'thisYear',
      label: 'This Year',
      start: startOfYear(today),
      end: endOfYear(today),
    },
    {
      key: 'lastYear',
      label: 'Last Year',
      start: startOfYear(subDays(today, 365)),
      end: endOfYear(subDays(today, 365)),
    },
  ]

  // Use custom presets if provided, otherwise use default presets
  const allDateRangePresets = customPresets || defaultDateRangePresets

  // Filter presets based on date constraints and excludePresets
  const dateRanges = React.useMemo(() => {
    return allDateRangePresets.filter((preset) => {
      // Check if preset is excluded
      if (excludePresets?.includes(preset.key))
        return false

      // Check if preset dates are within constraints
      const startValid = !isDateDisabled(preset.start)
      const endValid = !isDateDisabled(preset.end)

      // Check if preset range is within maxRange limit
      const rangeValid = numberOfMonths === 1 || isRangeValid(preset.start, preset.end)

      return startValid && endValid && rangeValid
    })
  }, [isDateDisabled, excludePresets, numberOfMonths, isRangeValid])

  const handleMouseOver = (part: string) => {
    setHighlightedPart(part)
  }

  const handleMouseLeave = () => {
    setHighlightedPart(null)
  }

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault()
    setSelectedRange(null)
    if (highlightedPart === 'firstDay') {
      const newDate = new Date(pendingDate?.from as Date)
      const increment = event.deltaY > 0 ? -1 : 1
      newDate.setDate(newDate.getDate() + increment)
      if (newDate <= (pendingDate?.to as Date)) {
        numberOfMonths === 2
          ? setPendingDate({ from: newDate, to: new Date(pendingDate?.to as Date) })
          : setPendingDate({ from: newDate, to: newDate })
        setMonthFrom(newDate)
      }
      else if (newDate > (pendingDate?.to as Date) && numberOfMonths === 1) {
        setPendingDate({ from: newDate, to: newDate })
        setMonthFrom(newDate)
      }
    }
    else if (highlightedPart === 'firstMonth') {
      const currentMonth = monthFrom ? monthFrom.getMonth() : 0
      const newMonthIndex = currentMonth + (event.deltaY > 0 ? -1 : 1)
      handleMonthChange(newMonthIndex, 'from')
    }
    else if (highlightedPart === 'firstYear' && yearFrom !== undefined) {
      const newYear = yearFrom + (event.deltaY > 0 ? -1 : 1)
      handleYearChange(newYear, 'from')
    }
    else if (highlightedPart === 'secondDay') {
      const newDate = new Date(pendingDate?.to as Date)
      const increment = event.deltaY > 0 ? -1 : 1
      newDate.setDate(newDate.getDate() + increment)
      if (newDate >= (pendingDate?.from as Date)) {
        setPendingDate({ from: new Date(pendingDate?.from as Date), to: newDate })
        setMonthTo(newDate)
      }
    }
    else if (highlightedPart === 'secondMonth') {
      const currentMonth = monthTo ? monthTo.getMonth() : 0
      const newMonthIndex = currentMonth + (event.deltaY > 0 ? -1 : 1)
      handleMonthChange(newMonthIndex, 'to')
    }
    else if (highlightedPart === 'secondYear' && yearTo !== undefined) {
      const newYear = yearTo + (event.deltaY > 0 ? -1 : 1)
      handleYearChange(newYear, 'to')
    }
  }

  React.useEffect(() => {
    const firstDayElement = document.getElementById(`firstDay-${id}`)
    const firstMonthElement = document.getElementById(`firstMonth-${id}`)
    const firstYearElement = document.getElementById(`firstYear-${id}`)
    const secondDayElement = document.getElementById(`secondDay-${id}`)
    const secondMonthElement = document.getElementById(`secondMonth-${id}`)
    const secondYearElement = document.getElementById(`secondYear-${id}`)

    const elements = [
      firstDayElement,
      firstMonthElement,
      firstYearElement,
      secondDayElement,
      secondMonthElement,
      secondYearElement,
    ]

    const addPassiveEventListener = (element: HTMLElement | null) => {
      if (element) {
        element.addEventListener('wheel', handleWheel as unknown as EventListener, {
          passive: false,
        })
      }
    }

    elements.forEach(addPassiveEventListener)

    return () => {
      elements.forEach((element) => {
        if (element) {
          element.removeEventListener('wheel', handleWheel as unknown as EventListener)
        }
      })
    }
  }, [highlightedPart, pendingDate])

  const formatWithTz = (date: Date, fmt: string) => formatInTimeZone(date, timeZone, fmt)

  return {
    // State
    isPopoverOpen,
    setIsPopoverOpen,
    selectedRange,
    setSelectedRange,
    monthFrom,
    setMonthFrom,
    yearFrom,
    setYearFrom,
    monthTo,
    setMonthTo,
    yearTo,
    setYearTo,
    highlightedPart,
    pendingDate,
    // Computed values
    timeZone,
    today,
    effectiveMinDate,
    effectiveMaxDate,
    years,
    dateRanges,
    // Callbacks
    isDateDisabled,
    getDaysDifference,
    isRangeValid,
    adjustRangeToMaxRange,
    handleTogglePopover,
    handleClear,
    handleApply,
    handleReset,
    selectDateRange,
    handleDateSelect,
    handleMonthChange,
    handleYearChange,
    handleMouseOver,
    handleMouseLeave,
    handleWheel,
    formatWithTz,
  }
}
