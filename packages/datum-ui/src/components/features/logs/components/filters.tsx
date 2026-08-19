'use client'

import type { LogFacet } from '../types'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../../../utils/cn'
import { Checkbox } from '../../../base/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../base/collapsible'
import { DateTimeRangePicker } from '../../picker/wrappers/date-time-range-picker'
import { useLogs } from '../hooks/use-logs'

export function LogsFilterGroup({
  facet,
  defaultOpen,
}: {
  facet: LogFacet
  defaultOpen?: boolean
}) {
  const { filters, toggleFilterValue } = useLogs()
  const selected = filters[facet.name] ?? []

  return (
    <Collapsible defaultOpen={defaultOpen} className="border-b border-border">
      <CollapsibleTrigger className="hover:bg-muted/40 flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium">
        {facet.label}
        <ChevronDown className="text-muted-foreground size-4 transition-transform [[data-state=open]_&]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="flex flex-col gap-1 px-3 pb-3">
          {facet.options.map(option => (
            <li key={option.value}>
              <label className="hover:bg-muted/40 flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-sm">
                <Checkbox
                  checked={selected.includes(option.value)}
                  onCheckedChange={() => toggleFilterValue(facet.name, option.value)}
                  aria-label={option.value}
                />
                <span className="min-w-0 flex-1 truncate font-mono text-xs">{option.value}</span>
                {option.count !== undefined && (
                  <span className="text-muted-foreground tabular-nums text-xs">{option.count}</span>
                )}
              </label>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function LogsTimeRangeFilter({ className }: { className?: string }) {
  const { timeRange, setTimeRange } = useLogs()

  return (
    <div className={cn('border-b border-border px-3 py-3', className)}>
      <div className="text-muted-foreground mb-2 text-xs font-medium">Time range</div>
      <DateTimeRangePicker
        value={timeRange}
        onChange={(next) => {
          if (next)
            setTimeRange({ from: next.from, to: next.to })
        }}
        placeholder="Select range"
        disableFuture
        hideTimezone
        numberOfMonths={1}
        className="w-full"
        triggerClassName="w-full justify-start text-xs"
        sheetTitle="Select time range"
      />
    </div>
  )
}

export function LogsFilters({ className }: { className?: string }) {
  const { facets, hasActiveFilters, resetFilters } = useLogs()

  return (
    <aside
      data-slot="logs-filters"
      className={cn('bg-background flex h-full min-h-0 w-64 shrink-0 flex-col border-r', className)}
    >
      <div className="flex items-center justify-between px-3 py-3">
        <h2 className="text-sm font-semibold">Filters</h2>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground text-xs disabled:opacity-40"
          disabled={!hasActiveFilters}
          onClick={resetFilters}
        >
          Reset
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <LogsTimeRangeFilter />
        {facets.map((facet, index) => (
          <LogsFilterGroup
            key={facet.name}
            facet={facet}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </aside>
  )
}
