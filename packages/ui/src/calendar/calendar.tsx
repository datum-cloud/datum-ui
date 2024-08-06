'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker, DayPickerProps } from 'react-day-picker'

import { calendarStyles, CalendarVariants } from './calendar.styles'
import { cn } from '../../lib/utils'
import { buttonStyles } from '../button/button'

export type CalendarProps = DayPickerProps &
  CalendarVariants & {
    classNames?: Partial<(typeof calendarStyles)['slots']>
  }

const components = {
  IconLeft: () => <ChevronLeft className="h-4 w-4" />,
  IconRight: () => <ChevronRight className="h-4 w-4" />,
}

function Calendar({
  className,
  classNames: customClassNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const styles = calendarStyles()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(styles.root(), className)}
      classNames={{
        months: styles.months(),
        month: styles.month(),
        caption: styles.caption(),
        caption_label: styles.caption_label(),
        nav: styles.nav(),
        nav_button: cn(
          buttonStyles({ variant: 'outline' }),
          styles.nav_button(),
          customClassNames?.nav_button,
        ),
        nav_button_previous: styles.nav_button_previous(),
        nav_button_next: styles.nav_button_next(),
        table: styles.table(),
        head_row: styles.head_row(),
        head_cell: styles.head_cell(),
        row: styles.row(),
        cell: styles.cell(),
        day: cn(
          buttonStyles({ variant: 'outline' }),
          styles.day(),
          customClassNames?.day,
        ),
        day_range_end: styles.day_range_end(),
        day_selected: cn(styles.day_selected(), customClassNames?.day_selected),
        day_today: styles.day_today(),
        day_outside: styles.day_outside(),
        day_disabled: styles.day_disabled(),
        day_range_middle: styles.day_range_middle(),
        day_hidden: styles.day_hidden(),
        ...customClassNames,
      }}
      components={components}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
