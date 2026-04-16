import type { DateRangePreset } from './types'
import { Button } from '@repo/shadcn/ui/button'
import { cn } from '../../../utils/cn'

interface CalendarPresetsProps {
  dateRanges: DateRangePreset[]
  selectedRange: string | null
  onSelect: (start: Date, end: Date, label: string) => void
}

export function CalendarPresets({
  dateRanges,
  selectedRange,
  onSelect,
}: CalendarPresetsProps) {
  return (
    <div className="border-foreground/10 hidden flex-col gap-1 border-r pr-4 text-left md:flex">
      {dateRanges.map(({ key, label, start, end }) => (
        <Button
          key={key}
          variant="ghost"
          size="sm"
          className={cn(
            'hover:bg-primary/90 hover:text-background justify-start',
            selectedRange === label
            && 'bg-primary text-background hover:bg-primary/90 hover:text-background',
          )}
          onClick={() => onSelect(start, end, label)}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}
