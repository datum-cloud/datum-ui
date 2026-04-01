import { Search } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../../utils/cn'

export interface TransferSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export const TransferSearch: React.FC<TransferSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  disabled = false,
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent pl-8 pr-3 py-1',
          'text-sm shadow-sm transition-colors',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      />
    </div>
  )
}
