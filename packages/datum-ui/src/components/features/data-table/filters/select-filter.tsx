'use client'

import type { FilterSelectProps } from '../types'
import { Check, ChevronDown, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '../../../../utils/cn'
import { Button } from '../../../base/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../../base/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../base/popover'
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
}: FilterSelectProps) {
  const { filters, setFilter, clearFilter, registerFilter, unregisterFilter } = useDataTableFilters()
  const [open, setOpen] = useState(false)
  const value = filters[column] as string | undefined

  useEffect(() => {
    registerFilter(column, 'select')
    return () => unregisterFilter(column)
  }, [column, registerFilter, unregisterFilter])

  const selectedOption = options.find(o => o.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          theme="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('h-10 justify-between', className)}
          data-slot="dt-filter"
          data-testid="dt-filter-trigger"
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : (placeholder ?? label)}
          </span>
          <div className="ml-2 flex items-center gap-1">
            {value && (
              <span
                role="button"
                aria-label={`Clear ${label} filter`}
                className="rounded-sm opacity-70 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  clearFilter(column)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    clearFilter(column)
                  }
                }}
                tabIndex={0}
              >
                <X className="size-3" />
              </span>
            )}
            <ChevronDown className="size-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('popover-content-width-full p-0', selectPopoverClassName)} align="start">
        <Command>
          {searchable && <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    setFilter(column, option.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 size-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
