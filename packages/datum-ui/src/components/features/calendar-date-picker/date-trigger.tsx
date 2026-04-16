import type { VariantProps } from 'class-variance-authority'
import type { DateRange } from 'react-day-picker'
import { Button } from '@repo/shadcn/ui/button'
import { CalendarIcon, X } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { multiSelectVariants } from './types'

interface DateTriggerProps extends VariantProps<typeof multiSelectVariants> {
  ref?: React.RefObject<HTMLButtonElement | null>
  id: string
  date: DateRange
  placeholder?: string
  disabled?: boolean
  numberOfMonths: 1 | 2
  highlightedPart: string | null
  handleMouseOver: (part: string) => void
  handleMouseLeave: () => void
  handleClear: (e: React.MouseEvent) => void
  handleTogglePopover: () => void
  formatWithTz: (date: Date, fmt: string) => string
  className?: string
  triggerClassName?: string
  [key: string]: unknown
}

export function DateTrigger({
  ref,
  id,
  date,
  placeholder,
  disabled,
  numberOfMonths,
  highlightedPart,
  handleMouseOver,
  handleMouseLeave,
  handleClear,
  handleTogglePopover,
  formatWithTz,
  variant,
  className,
  triggerClassName,
  ...props
}: DateTriggerProps) {
  return (
    <Button
      id="date"
      ref={ref}
      {...props}
      disabled={disabled}
      className={cn(
        'w-full',
        triggerClassName,
        multiSelectVariants({ variant, className }),
      )}
      onClick={handleTogglePopover}
      suppressHydrationWarning
    >
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="text-muted-foreground h-4 w-4" />
          <span>
            {date?.from
              ? (
                  date.to
                    ? (
                        <>
                          <span
                            id={`firstDay-${id}`}
                            className={cn(
                              'date-part',
                              highlightedPart === 'firstDay' && 'font-bold underline',
                            )}
                            onMouseOver={() => handleMouseOver('firstDay')}
                            onMouseLeave={handleMouseLeave}
                          >
                            {formatWithTz(date.from, 'dd')}
                          </span>
                          {' '}
                          <span
                            id={`firstMonth-${id}`}
                            className={cn(
                              'date-part',
                              highlightedPart === 'firstMonth' && 'font-bold underline',
                            )}
                            onMouseOver={() => handleMouseOver('firstMonth')}
                            onMouseLeave={handleMouseLeave}
                          >
                            {formatWithTz(date.from, 'LLL')}
                          </span>
                          ,
                          {' '}
                          <span
                            id={`firstYear-${id}`}
                            className={cn(
                              'date-part',
                              highlightedPart === 'firstYear' && 'font-bold underline',
                            )}
                            onMouseOver={() => handleMouseOver('firstYear')}
                            onMouseLeave={handleMouseLeave}
                          >
                            {formatWithTz(date.from, 'y')}
                          </span>
                          {numberOfMonths === 2 && (
                            <>
                              {' - '}
                              <span
                                id={`secondDay-${id}`}
                                className={cn(
                                  'date-part',
                                  highlightedPart === 'secondDay' && 'font-bold underline',
                                )}
                                onMouseOver={() => handleMouseOver('secondDay')}
                                onMouseLeave={handleMouseLeave}
                              >
                                {formatWithTz(date.to, 'dd')}
                              </span>
                              {' '}
                              <span
                                id={`secondMonth-${id}`}
                                className={cn(
                                  'date-part',
                                  highlightedPart === 'secondMonth' && 'font-bold underline',
                                )}
                                onMouseOver={() => handleMouseOver('secondMonth')}
                                onMouseLeave={handleMouseLeave}
                              >
                                {formatWithTz(date.to, 'LLL')}
                              </span>
                              ,
                              {' '}
                              <span
                                id={`secondYear-${id}`}
                                className={cn(
                                  'date-part',
                                  highlightedPart === 'secondYear' && 'font-bold underline',
                                )}
                                onMouseOver={() => handleMouseOver('secondYear')}
                                onMouseLeave={handleMouseLeave}
                              >
                                {formatWithTz(date.to, 'y')}
                              </span>
                            </>
                          )}
                        </>
                      )
                    : (
                        <>
                          <span
                            id="day"
                            className={cn(
                              'date-part',
                              highlightedPart === 'day' && 'font-bold underline',
                            )}
                            onMouseOver={() => handleMouseOver('day')}
                            onMouseLeave={handleMouseLeave}
                          >
                            {formatWithTz(date.from, 'dd')}
                          </span>
                          {' '}
                          <span
                            id="month"
                            className={cn(
                              'date-part',
                              highlightedPart === 'month' && 'font-bold underline',
                            )}
                            onMouseOver={() => handleMouseOver('month')}
                            onMouseLeave={handleMouseLeave}
                          >
                            {formatWithTz(date.from, 'LLL')}
                          </span>
                          ,
                          {' '}
                          <span
                            id="year"
                            className={cn(
                              'date-part',
                              highlightedPart === 'year' && 'font-bold underline',
                            )}
                            onMouseOver={() => handleMouseOver('year')}
                            onMouseLeave={handleMouseLeave}
                          >
                            {formatWithTz(date.from, 'y')}
                          </span>
                        </>
                      )
                )
              : (
                  <span className="text-muted-foreground">{placeholder || 'Pick a date'}</span>
                )}
          </span>
        </div>
        {date?.from && (
          <div
            onClick={handleClear}
            className="text-muted-foreground hover:text-primary size-4 p-0 hover:bg-transparent"
          >
            <X size={14} />
            <span className="sr-only">Clear date</span>
          </div>
        )}
      </div>
    </Button>
  )
}
