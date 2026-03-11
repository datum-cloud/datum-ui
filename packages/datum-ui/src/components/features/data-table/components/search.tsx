'use client'

import type { SearchProps } from '../types'
import { useEffect, useState } from 'react'
import { Input } from '../../../base/input'
import { DEFAULT_DEBOUNCE_MS } from '../constants'
import { useDataTableSearch } from '../hooks/use-selectors'

export function DataTableSearch({
  placeholder = 'Search...',
  debounceMs = DEFAULT_DEBOUNCE_MS,
  className,
}: SearchProps) {
  const { search, setSearch } = useDataTableSearch()
  const [inputValue, setInputValue] = useState(search)

  useEffect(() => {
    setInputValue(search)
  }, [search])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== search) {
        setSearch(inputValue)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [inputValue, debounceMs, search, setSearch])

  return (
    <Input
      placeholder={placeholder}
      value={inputValue}
      onChange={e => setInputValue(e.target.value)}
      className={className}
      aria-label={placeholder}
      data-slot="dt-search"
    />
  )
}
