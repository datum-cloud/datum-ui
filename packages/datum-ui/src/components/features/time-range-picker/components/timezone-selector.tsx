import type { TimezoneOption } from '../types'
import { Globe } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../..'
import { cn } from '../../../../utils/cn'

interface TimezoneSelectorProps {
  value: string
  onChange: (value: string) => void
  options: TimezoneOption[]
  className?: string
}

export function TimezoneSelector({ value, onChange, options, className }: TimezoneSelectorProps) {
  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Globe className="text-muted-foreground h-4 w-4 shrink-0" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="hover:bg-accent h-8 min-w-[180px] border-0 bg-transparent px-2 text-xs shadow-none">
          <SelectValue placeholder="Select timezone">{selectedOption?.label ?? value}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
