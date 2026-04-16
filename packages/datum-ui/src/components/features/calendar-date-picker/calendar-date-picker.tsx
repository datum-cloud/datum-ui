import type { CalendarDatePickerProps } from './types'
import { Button } from '@repo/shadcn/ui/button'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { Calendar } from '../../base/calendar/calendar'
import { ResponsivePopover } from '../../base/responsive-popover'
import { CalendarHeader } from './calendar-header'
import { CalendarPresets } from './calendar-presets'
import { DateTrigger } from './date-trigger'
import { useCalendarDatePicker } from './use-calendar-date-picker'

export type { CalendarDatePickerProps }

export function CalendarDatePicker({
  ref,
  id = 'calendar-date-picker',
  className,
  triggerClassName,
  date,
  closeOnSelect = false,
  numberOfMonths = 2,
  yearsRange = 10,
  onDateSelect,
  variant,
  placeholder,
  excludePresets,
  customPresets,
  minDate,
  maxDate,
  disableFuture = false,
  disablePast = false,
  maxRange,
  popoverClassName,
  disabled,
  modal = false,
  responsive,
  sheetTitle,
  ...props
}: CalendarDatePickerProps & { ref?: React.RefObject<HTMLButtonElement | null> }) {
  const picker = useCalendarDatePicker({
    id,
    date,
    closeOnSelect,
    numberOfMonths,
    yearsRange,
    onDateSelect,
    excludePresets,
    customPresets,
    minDate,
    maxDate,
    disableFuture,
    disablePast,
    maxRange,
  })

  return (
    <>
      <style>
        {`
            .date-part {
              touch-action: none;
            }
          `}
      </style>
      <ResponsivePopover
        open={picker.isPopoverOpen}
        onOpenChange={picker.setIsPopoverOpen}
        responsive={responsive}
        sheetTitle={sheetTitle ?? placeholder ?? 'Pick a date'}
        align="center"
        avoidCollisions={false}
        contentClassName={cn('w-full sm:w-auto popover-content-width-full', popoverClassName)}
        modal={modal}
        onInteractOutside={() => picker.setIsPopoverOpen(false)}
        onEscapeKeyDown={() => picker.setIsPopoverOpen(false)}
        trigger={(
          <DateTrigger
            ref={ref}
            id={id}
            date={date}
            placeholder={placeholder}
            disabled={disabled}
            numberOfMonths={numberOfMonths}
            highlightedPart={picker.highlightedPart}
            handleMouseOver={picker.handleMouseOver}
            handleMouseLeave={picker.handleMouseLeave}
            handleClear={picker.handleClear}
            handleTogglePopover={picker.handleTogglePopover}
            formatWithTz={picker.formatWithTz}
            variant={variant}
            className={className}
            triggerClassName={triggerClassName}
            {...props}
          />
        )}
      >
        {picker.isPopoverOpen && (
          <div
            style={{
              maxHeight: 'var(--radix-popover-content-available-height)',
              overflowY: 'auto',
            }}
          >
            <div className="flex">
              {numberOfMonths === 2 && (
                <CalendarPresets
                  dateRanges={picker.dateRanges}
                  selectedRange={picker.selectedRange}
                  onSelect={(start, end, label) => {
                    picker.selectDateRange(start, end, label)
                    picker.setMonthFrom(start)
                    picker.setYearFrom(start.getFullYear())
                    picker.setMonthTo(end)
                    picker.setYearTo(end.getFullYear())
                  }}
                />
              )}
              <div className="flex w-full flex-col">
                <CalendarHeader
                  monthFrom={picker.monthFrom}
                  yearFrom={picker.yearFrom}
                  monthTo={picker.monthTo}
                  yearTo={picker.yearTo}
                  years={picker.years}
                  numberOfMonths={numberOfMonths}
                  onMonthChange={(month, target) => {
                    picker.handleMonthChange(month, target)
                    picker.setSelectedRange(null)
                  }}
                  onYearChange={(year, target) => {
                    picker.handleYearChange(year, target)
                    picker.setSelectedRange(null)
                  }}
                />
                <div className="flex w-full justify-center">
                  <Calendar
                    mode="range"
                    defaultMonth={picker.monthFrom}
                    month={picker.monthFrom}
                    onMonthChange={picker.setMonthFrom}
                    selected={picker.pendingDate}
                    onSelect={picker.handleDateSelect}
                    numberOfMonths={numberOfMonths}
                    showOutsideDays={false}
                    disabled={picker.isDateDisabled}
                    fromDate={picker.effectiveMinDate}
                    toDate={picker.effectiveMaxDate}
                    className={cn('w-full sm:w-auto', className)}
                  />
                </div>
                {!closeOnSelect && (
                  <div className="flex justify-end gap-2 border-t p-3">
                    <Button variant="outline" size="sm" onClick={picker.handleReset} type="button">
                      Reset
                    </Button>
                    <Button size="sm" onClick={picker.handleApply} type="button">
                      Apply
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </ResponsivePopover>
    </>
  )
}

CalendarDatePicker.displayName = 'CalendarDatePicker'
