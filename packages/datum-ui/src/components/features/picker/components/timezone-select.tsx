import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shadcn/ui/select'
import { Globe } from 'lucide-react'
import { cn } from '../../../../utils/cn'
import { isTimeBearingMode } from '../types'
import { usePickerContext } from './context'

interface TimezoneOption {
  value: string
  label: string
}

interface PickerTimezoneSelectProps {
  options: TimezoneOption[]
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

export function PickerTimezoneSelect({
  options,
  onChange,
  className,
  placeholder = 'Select timezone',
}: PickerTimezoneSelectProps) {
  const { mode, timezone } = usePickerContext()

  if (!isTimeBearingMode(mode))
    return null

  return (
    <div data-slot="picker-tz-select" className={cn('flex items-center gap-2 px-3 py-2', className)}>
      <Globe className="text-muted-foreground size-4 shrink-0" />
      <Select value={timezone} onValueChange={onChange}>
        <SelectTrigger className="hover:bg-accent h-8 min-w-[180px] border-0 bg-transparent px-2 text-xs shadow-none">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
PickerTimezoneSelect.displayName = 'Picker.TimezoneSelect'
