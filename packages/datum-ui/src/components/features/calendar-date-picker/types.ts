import type { VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import type { DateRange } from 'react-day-picker'
import { cva } from 'class-variance-authority'

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const multiSelectVariants = cva(
  'flex font-normal shadow-none items-center justify-center whitespace-nowrap rounded-md text-sm text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground text-background',
        link: 'text-primary underline-offset-4 hover:underline text-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface DateRangePreset {
  key: string
  label: string
  start: Date
  end: Date
}

export interface CalendarDatePickerProps
  extends React.HTMLAttributes<HTMLButtonElement>, VariantProps<typeof multiSelectVariants> {
  id?: string
  className?: string
  triggerClassName?: string
  date: DateRange
  closeOnSelect?: boolean
  numberOfMonths?: 1 | 2
  yearsRange?: number
  onDateSelect: (range: { from: Date, to: Date } | undefined) => void
  placeholder?: string
  excludePresets?: string[]
  customPresets?: DateRangePreset[] // Custom presets to use instead of default ones
  // Date range constraints
  minDate?: Date
  maxDate?: Date
  disableFuture?: boolean
  disablePast?: boolean
  maxRange?: number // Maximum number of days between start and end date
  popoverClassName?: string
  disabled?: boolean
  modal?: boolean // Whether the popover is modal (prevents interaction with elements outside). Required when using inside a Dialog/Modal component
  /** Force desktop popover even on mobile. Default: true. */
  responsive?: boolean
  /** Title shown in the mobile sheet header. Defaults to placeholder ?? 'Pick a date'. */
  sheetTitle?: string
}
