'use client'

import type { FilterCheckboxProps } from '../types'
import { ChevronDown, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '../../../../utils/cn'
import { Badge } from '../../../base/badge'
import { Button } from '../../../base/button'
import { Checkbox } from '../../../base/checkbox'
import { Label } from '../../../base/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../base/popover'
import { useDataTableFilters } from '../hooks/use-selectors'

const MAX_VISIBLE_BADGES = 2

export function CheckboxFilter({
  column,
  label,
  options,
  className,
  checkboxPopoverClassName,
}: FilterCheckboxProps) {
  const { filters, setFilter, clearFilter, registerFilter, unregisterFilter } = useDataTableFilters()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    registerFilter(column, 'checkbox')
    return () => unregisterFilter(column)
  }, [column, registerFilter, unregisterFilter])
  const selectedValues = (filters[column] as string[] | undefined) ?? []

  const updateValues = (newValues: string[]) => {
    if (newValues.length > 0) {
      setFilter(column, newValues)
    }
    else {
      clearFilter(column)
    }
  }

  const handleToggle = (optionValue: string, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, optionValue]
      : selectedValues.filter(v => v !== optionValue)
    updateValues(newValues)
  }

  const removeValue = (optionValue: string) => {
    updateValues(selectedValues.filter(v => v !== optionValue))
  }

  const visibleBadges = selectedValues.slice(0, MAX_VISIBLE_BADGES)
  const remainingCount = selectedValues.length - MAX_VISIBLE_BADGES

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          theme="outline"
          className={cn('justify-between gap-1', className)}
          data-slot="dt-filter"
          data-testid="dt-filter-trigger"
        >
          {selectedValues.length > 0
            ? (
                <div className="flex items-center gap-1 flex-wrap">
                  {visibleBadges.map((val) => {
                    const opt = options.find(o => o.value === val)
                    return (
                      <Badge key={val} type="secondary" theme="light" className="text-xs px-1.5 py-0">
                        {opt?.label ?? val}
                        <span
                          role="button"
                          tabIndex={0}
                          aria-label={`Remove ${opt?.label ?? val}`}
                          className="ml-1 rounded-sm hover:bg-muted"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeValue(val)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              removeValue(val)
                            }
                          }}
                        >
                          <X className="size-3" />
                        </span>
                      </Badge>
                    )
                  })}
                  {remainingCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      +
                      {remainingCount}
                      {' '}
                      more
                    </span>
                  )}
                </div>
              )
            : (
                <span>{label}</span>
              )}
          <ChevronDown className="size-4 opacity-50 ml-auto shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('popover-content-width-full p-0', checkboxPopoverClassName)} align="start">
        <div className="flex items-center justify-between p-2 border-b">
          <span className="text-sm font-medium">{label}</span>
          {selectedValues.length > 0 && (
            <Button
              theme="borderless"
              size="small"
              className="h-auto p-1 text-xs"
              onClick={() => clearFilter(column)}
            >
              Clear
            </Button>
          )}
        </div>
        <div className="max-h-48 overflow-y-auto p-2">
          <div className="flex flex-col gap-2">
            {options.map(option => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`${column}-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={checked => handleToggle(option.value, checked === true)}
                />
                <Label htmlFor={`${column}-${option.value}`} className="text-sm font-normal cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
