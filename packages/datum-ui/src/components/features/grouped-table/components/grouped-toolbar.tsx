import { useEffect, useState } from 'react'
import { cn } from '../../../../utils/cn'
import { Input } from '../../../base/input'

const DEFAULT_DEBOUNCE_MS = 300

export interface GroupedToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
  className?: string
}

export function GroupedToolbar({
  search,
  onSearchChange,
  placeholder = 'Search...',
  debounceMs = DEFAULT_DEBOUNCE_MS,
  className,
}: GroupedToolbarProps) {
  const [value, setValue] = useState(search)

  useEffect(() => {
    setValue(search)
  }, [search])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== search)
        onSearchChange(value)
    }, debounceMs)
    return () => clearTimeout(timer)
  }, [value, debounceMs, search, onSearchChange])

  return (
    <div className={cn('pb-3', className)} data-slot="gt-toolbar">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        aria-label={placeholder}
        data-slot="gt-search"
      />
    </div>
  )
}
