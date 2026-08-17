'use client'

import type { MultiSelectOption } from '../../multi-select/multi-select'
import type { FilterCheckboxProps } from '../types'
import { useEffect } from 'react'
import { MultiSelect } from '../../multi-select'
import { useDataTableFilters } from '../hooks/use-selectors'

export function CheckboxFilter({
  column,
  label,
  options,
  className,
  disabled,
  responsive,
  sheetTitle,
  modal,
}: FilterCheckboxProps) {
  const { filters, setFilter, clearFilter, registerFilter, unregisterFilter } = useDataTableFilters()

  useEffect(() => {
    registerFilter(column, 'checkbox')
    return () => unregisterFilter(column)
  }, [column, registerFilter, unregisterFilter])

  // Filter values can arrive as a string (e.g. a single value hydrated from the
  // URL) rather than a string[]. MultiSelect requires an array, so normalize
  // scalars into a single-element array instead of blindly casting.
  const rawValue = filters[column]
  const selectedValues = Array.isArray(rawValue)
    ? (rawValue as string[])
    : rawValue == null
      ? []
      : [String(rawValue)]

  return (
    <MultiSelect
      options={options as MultiSelectOption[]}
      value={selectedValues}
      onValueChange={(next) => {
        if (next.length > 0)
          setFilter(column, next)
        else clearFilter(column)
      }}
      placeholder={label}
      sheetTitle={sheetTitle ?? label}
      responsive={responsive}
      modalPopover={modal}
      maxCount={2}
      showClearButton
      showSelectAll={false}
      disabled={disabled}
      className={className}
    />
  )
}
