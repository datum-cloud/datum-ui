import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedSearchInput } from '../../../../hooks/use-debounced-search-input'
import { cn } from '../../../../utils/cn'
import { Input } from '../../../base/input'

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
  debounceMs = DEFAULT_SEARCH_DEBOUNCE_MS,
  className,
}: GroupedToolbarProps) {
  const [value, setValue] = useDebouncedSearchInput(search, onSearchChange, debounceMs)

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
