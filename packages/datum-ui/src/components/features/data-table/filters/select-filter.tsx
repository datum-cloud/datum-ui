'use client'

import type { FilterSelectProps } from '../types'
import { useEffect } from 'react'
import { Autocomplete } from '../../autocomplete'
import { useDataTableFilters } from '../hooks/use-selectors'

export function SelectFilter({
  column,
  label,
  options,
  placeholder,
  searchable = true,
  className,
  selectPopoverClassName,
  disabled,
  responsive,
  sheetTitle,
  modal,
}: FilterSelectProps) {
  const { filters, setFilter, clearFilter, registerFilter, unregisterFilter } = useDataTableFilters()
  const value = filters[column] as string | undefined

  useEffect(() => {
    registerFilter(column, 'select')
    return () => unregisterFilter(column)
  }, [column, registerFilter, unregisterFilter])

  return (
    <Autocomplete
      // Autocomplete accepts a mutable array; readonly input is fine at runtime.
      options={options as { label: string, value: string }[]}
      value={value}
      onValueChange={(next) => {
        if (next === '' || next === undefined) {
          clearFilter(column)
        }
        else {
          setFilter(column, next)
        }
      }}
      placeholder={placeholder ?? label}
      searchPlaceholder={`Search ${label.toLowerCase()}...`}
      disableSearch={!searchable}
      sheetTitle={sheetTitle ?? label}
      responsive={responsive}
      modal={modal}
      disabled={disabled}
      className={className}
      contentClassName={selectPopoverClassName}
      triggerClassName="h-10"
    />
  )
}
