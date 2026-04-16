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

  const selectedValues = (filters[column] as string[] | undefined) ?? []

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
