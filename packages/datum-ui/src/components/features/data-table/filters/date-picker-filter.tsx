'use client'

import type { DateRange } from 'react-day-picker'
import type { FilterDatePickerProps } from '../types'
import { useEffect, useMemo } from 'react'
import { CalendarDatePicker } from '../../calendar-date-picker/calendar-date-picker'
import { useDataTableFilters } from '../hooks/use-selectors'

export function DatePickerFilter({
  column,
  label,
  className,
  datePickerPopoverClassName,
  disableFuture,
  disablePast,
  minDate,
  maxDate,
}: FilterDatePickerProps) {
  const { filters, setFilter, clearFilter, registerFilter, unregisterFilter } = useDataTableFilters()
  const rawValue = filters[column] as string | undefined

  useEffect(() => {
    registerFilter(column, 'date-gte')
    return () => unregisterFilter(column)
  }, [column, registerFilter, unregisterFilter])

  const dateRange: DateRange = useMemo(
    () => {
      const date = rawValue ? new Date(rawValue) : undefined
      return { from: date, to: date }
    },
    [rawValue],
  )

  return (
    <div data-slot="dt-filter">
      <CalendarDatePicker
        date={dateRange}
        numberOfMonths={1}
        closeOnSelect
        placeholder={label}
        triggerClassName={className}
        variant="outline"
        disableFuture={disableFuture}
        disablePast={disablePast}
        minDate={minDate}
        maxDate={maxDate}
        popoverClassName={datePickerPopoverClassName}
        onDateSelect={(range) => {
          if (range?.from) {
            setFilter(column, range.from.toISOString())
          }
          else {
            clearFilter(column)
          }
        }}
      />
    </div>
  )
}
