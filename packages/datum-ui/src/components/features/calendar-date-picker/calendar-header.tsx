import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../base/select/select'
import { months } from './types'

interface CalendarHeaderProps {
  monthFrom: Date | undefined
  yearFrom: number | undefined
  monthTo: Date | undefined
  yearTo: number | undefined
  years: number[]
  numberOfMonths: 1 | 2
  onMonthChange: (month: number, target: 'from' | 'to') => void
  onYearChange: (year: number, target: 'from' | 'to') => void
}

export function CalendarHeader({
  monthFrom,
  yearFrom,
  monthTo,
  yearTo,
  years,
  numberOfMonths,
  onMonthChange,
  onYearChange,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center gap-4 px-3 py-2 sm:px-4 sm:py-3">
      <div className="flex gap-2">
        <Select
          onValueChange={(value) => {
            onMonthChange(months.indexOf(value), 'from')
          }}
          value={monthFrom ? months[monthFrom.getMonth()] : undefined}
        >
          <SelectTrigger className="hover:bg-accent hover:text-accent-foreground hidden w-[122px] font-medium focus:ring-0 focus:ring-offset-0 sm:flex">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, idx) => (
              <SelectItem key={idx} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            onYearChange(Number(value), 'from')
          }}
          value={yearFrom ? yearFrom.toString() : undefined}
        >
          <SelectTrigger className="hover:bg-accent hover:text-accent-foreground hidden w-[122px] font-medium focus:ring-0 focus:ring-offset-0 sm:flex">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year, idx) => (
              <SelectItem key={idx} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {numberOfMonths === 2 && (
        <div className="flex gap-2">
          <Select
            onValueChange={(value) => {
              onMonthChange(months.indexOf(value), 'to')
            }}
            value={monthTo ? months[monthTo.getMonth()] : undefined}
          >
            <SelectTrigger className="hover:bg-accent hover:text-accent-foreground hidden w-[122px] font-medium focus:ring-0 focus:ring-offset-0 sm:flex">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, idx) => (
                <SelectItem key={idx} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => {
              onYearChange(Number(value), 'to')
            }}
            value={yearTo ? yearTo.toString() : undefined}
          >
            <SelectTrigger className="hover:bg-accent hover:text-accent-foreground hidden w-[122px] font-medium focus:ring-0 focus:ring-offset-0 sm:flex">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year, idx) => (
                <SelectItem key={idx} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
