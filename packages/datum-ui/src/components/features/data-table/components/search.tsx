'use client'

import type { SearchProps } from '../types'
import { useDebouncedSearchInput } from '../../../../hooks/use-debounced-search-input'
import { Input } from '../../../base/input'
import { DEFAULT_DEBOUNCE_MS } from '../constants'
import { useDataTableSearch } from '../hooks/use-selectors'

export function DataTableSearch({
  placeholder = 'Search...',
  debounceMs = DEFAULT_DEBOUNCE_MS,
  className,
  disabled,
}: SearchProps) {
  const { search, setSearch } = useDataTableSearch()
  const [inputValue, setInputValue] = useDebouncedSearchInput(search, setSearch, debounceMs)

  return (
    <Input
      placeholder={placeholder}
      value={inputValue}
      onChange={e => setInputValue(e.target.value)}
      className={className}
      disabled={disabled}
      aria-label={placeholder}
      data-slot="dt-search"
    />
  )
}
