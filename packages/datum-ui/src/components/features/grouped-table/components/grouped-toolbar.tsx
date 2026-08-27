import { Search as SearchIconLucide, X as XIconLucide } from 'lucide-react'
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedSearchInput } from '../../../../hooks/use-debounced-search-input'
import { cn } from '../../../../utils/cn'
import { Button } from '../../../base/button'
import { Icon } from '../../../icons/icon-wrapper'
import { InputWithAddons } from '../../input-with-addons'

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
      <div className="w-full min-w-full flex-1 rounded-md sm:max-w-3xs md:min-w-80">
        <InputWithAddons
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => setValue(e.target.value)}
          containerClassName="h-9 bg-transparent"
          className="placeholder:text-secondary text-secondary h-full bg-transparent text-xs placeholder:text-xs md:text-xs dark:text-white dark:placeholder:text-white"
          aria-label={placeholder}
          data-slot="gt-search"
          leading={(
            <Icon
              icon={SearchIconLucide}
              size={14}
              className="text-icon-quaternary dark:text-white"
            />
          )}
          trailing={
            value
              ? (
                  <Button
                    type="quaternary"
                    theme="borderless"
                    size="icon"
                    onClick={() => setValue('')}
                    className="hover:text-destructive text-icon-quaternary size-4 p-0 hover:bg-transparent dark:text-white"
                  >
                    <Icon icon={XIconLucide} size={14} />
                    <span className="sr-only">Clear search</span>
                  </Button>
                )
              : undefined
          }
        />
      </div>
    </div>
  )
}
