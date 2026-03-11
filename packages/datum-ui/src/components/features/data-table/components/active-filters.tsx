'use client'

import type { ActiveFiltersProps } from '../types'
import { X } from 'lucide-react'
import { memo } from 'react'
import { cn } from '../../../../utils/cn'
import { Badge } from '../../../base/badge'
import { Button } from '../../../base/button'
import { useDataTableFilters, useDataTableSearch } from '../hooks/use-selectors'

function formatValue(column: string, value: unknown, formatter?: ActiveFiltersProps['formatFilterValue']): string {
  if (formatter) {
    const result = formatter(column, value)
    if (result !== undefined)
      return result
  }
  return String(value)
}

function FilterGroup({
  label,
  children,
  className,
}: {
  readonly label: string
  readonly children: React.ReactNode
  readonly className?: string
}) {
  return (
    <div
      className={cn('flex items-center gap-2 rounded-md border px-2 py-1', className)}
      data-slot="dt-filter-group"
      data-testid="dt-filter-group"
    >
      <span className="text-muted-foreground border-r pr-2 text-xs">{label}</span>
      {children}
    </div>
  )
}

const EMPTY_LABELS: Record<string, string> = {}

function ActiveFiltersInner({
  label = 'Selected Filters',
  filterLabels = EMPTY_LABELS,
  formatFilterValue: formatter,
  clearAll = 'icon',
  clearAllLabel = 'Clear all',
  className,
  groupClassName,
  badgeClassName,
}: ActiveFiltersProps) {
  const { filters, setFilter, clearFilter, clearAllFilters } = useDataTableFilters()
  const { search, clearSearch } = useDataTableSearch()

  const activeFilterEntries = Object.entries(filters).filter(
    ([, value]) => value != null && value !== '' && !(Array.isArray(value) && value.length === 0),
  )

  const hasSearch = search.length > 0
  const hasFilters = activeFilterEntries.length > 0
  if (!hasSearch && !hasFilters)
    return null

  const totalGroups = activeFilterEntries.length + (hasSearch ? 1 : 0)

  const removeArrayItem = (column: string, items: string[], item: string) => {
    const remaining = items.filter(v => v !== item)
    if (remaining.length > 0) {
      setFilter(column, remaining)
    }
    else {
      clearFilter(column)
    }
  }

  const handleClearAll = () => {
    clearAllFilters()
    if (hasSearch)
      clearSearch()
  }

  const badgeCn = cn('flex items-center gap-1.5 px-2 py-0.5 text-xs', badgeClassName)

  return (
    <div
      className={cn('flex flex-wrap items-center gap-2', className)}
      data-slot="dt-active-filters"
      data-testid="dt-active-filters"
    >
      {label !== null && (
        <span className="text-sm text-muted-foreground" data-slot="dt-active-filters-label">
          {label}
        </span>
      )}

      {hasSearch && (
        <FilterGroup label="Search" className={groupClassName}>
          <Badge type="muted" theme="solid" className={badgeCn}>
            <span>{search}</span>
            <Button
              theme="borderless"
              size="small"
              aria-label="Clear search"
              className="h-auto p-0 text-muted-foreground hover:text-foreground"
              onClick={clearSearch}
            >
              <X className="size-2.5" aria-hidden="true" />
            </Button>
          </Badge>
        </FilterGroup>
      )}

      {activeFilterEntries.map(([column, value]) => {
        const groupLabel = filterLabels[column] ?? column

        if (Array.isArray(value)) {
          return (
            <FilterGroup key={column} label={groupLabel} className={groupClassName}>
              {value.map(item => (
                <Badge key={item} type="muted" theme="solid" className={badgeCn}>
                  <span>{formatValue(column, item, formatter)}</span>
                  <Button
                    theme="borderless"
                    size="small"
                    aria-label={`Remove ${formatValue(column, item, formatter)} from ${groupLabel}`}
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => removeArrayItem(column, value as string[], item)}
                  >
                    <X className="size-2.5" aria-hidden="true" />
                  </Button>
                </Badge>
              ))}
            </FilterGroup>
          )
        }

        return (
          <FilterGroup key={column} label={groupLabel} className={groupClassName}>
            <Badge type="muted" theme="solid" className={badgeCn}>
              <span>{formatValue(column, value, formatter)}</span>
              <Button
                theme="borderless"
                size="small"
                aria-label={`Clear ${groupLabel} filter`}
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => clearFilter(column)}
              >
                <X className="size-2.5" aria-hidden="true" />
              </Button>
            </Badge>
          </FilterGroup>
        )
      })}

      {totalGroups > 1 && (
        <>
          {clearAll === 'icon' && (
            <Button
              theme="borderless"
              size="small"
              aria-label={clearAllLabel}
              title={clearAllLabel}
              className="h-auto p-1 text-muted-foreground hover:text-foreground"
              data-slot="dt-clear-all-filters"
              data-testid="dt-clear-all-filters"
              onClick={handleClearAll}
            >
              <X className="size-4" />
            </Button>
          )}
          {clearAll === 'button' && (
            <Button
              theme="outline"
              size="small"
              className="h-auto px-2 py-1 text-xs"
              data-slot="dt-clear-all-filters"
              data-testid="dt-clear-all-filters"
              onClick={handleClearAll}
            >
              <X className="size-3 mr-1" />
              {clearAllLabel}
            </Button>
          )}
          {clearAll === 'text' && (
            <Button
              theme="borderless"
              size="small"
              className="h-auto px-1 py-0.5 text-xs text-muted-foreground hover:text-foreground"
              data-slot="dt-clear-all-filters"
              data-testid="dt-clear-all-filters"
              onClick={handleClearAll}
            >
              {clearAllLabel}
            </Button>
          )}
        </>
      )}
    </div>
  )
}

export const DataTableActiveFilters = memo(ActiveFiltersInner)
