'use client'

import type { LogFacet, LogTimeRange } from '../types'
import { ChevronDown, Clock } from 'lucide-react'
import { cn } from '../../../../utils/cn'
import { Checkbox } from '../../../base/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../base/collapsible'
import { Skeleton } from '../../../base/skeleton'
import { Icon } from '../../../icons/icon-wrapper'
import { DateTimeRangePicker } from '../../picker/wrappers/date-time-range-picker'
import { useLogs } from '../hooks/use-logs'
import { LOG_TIME_PRESETS, logTimeRangeLabel } from '../utils/time-range'

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
        <Icon icon={ChevronDown} className="text-muted-foreground transition-transform [[data-state=open]_&]:rotate-180" />
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

function isLogTimeRange(value: unknown): value is LogTimeRange {
  return typeof value === 'object'
    && value !== null
    && typeof (value as LogTimeRange).from === 'string'
    && typeof (value as LogTimeRange).to === 'string'
}

export function LogsTimeRangeFilter({ className }: { className?: string }) {
  const { timeRange, setTimeRange } = useLogs()

  return (
    <div className={cn('border-b border-border px-3 py-3', className)}>
      <div className="text-muted-foreground mb-2 text-xs font-medium">Time range</div>
      <DateTimeRangePicker
        value={timeRange}
        onChange={(next) => {
          if (!next)
            return
          const preset = (next as LogTimeRange).preset
          setTimeRange(preset ? { from: next.from, to: next.to, preset } : { from: next.from, to: next.to })
        }}
        presets={LOG_TIME_PRESETS}
        triggerLabel={value => isLogTimeRange(value) ? logTimeRangeLabel(value) : 'Select range'}
        icon={<Icon icon={Clock} className="text-muted-foreground shrink-0" />}
        placeholder="Select range"
        clearable={false}
        disableFuture
        hideTimezone
        numberOfMonths={1}
        className="w-full"
        triggerClassName="w-full justify-start text-xs"
        popoverClassName="w-auto"
        sheetTitle="Select time range"
      />
    </div>
  )
}

const FILTER_LABEL_CHS = [6, 11, 4] as const
const FILTER_VALUE_CHS = [3, 8, 14, 6, 20, 11, 4, 16] as const

function LogsFiltersSkeleton() {
  return (
    <div data-slot="logs-filters-skeleton" className="flex flex-col" aria-hidden>
      {Array.from({ length: 3 }, (_, group) => (
        <div key={group} className="border-b border-border">
          <div className="flex w-full items-center justify-between px-3 py-2">
            <Skeleton
              className="h-[21px] rounded-sm font-medium"
              style={{ width: `${FILTER_LABEL_CHS[group] ?? 8}ch` }}
            />
            <Skeleton className="size-4 shrink-0 rounded-sm" />
          </div>
          <ul className="flex flex-col gap-1 px-3 pb-3">
            {Array.from({ length: 4 }, (_, row) => (
              <li key={row} className="flex items-center gap-2 px-1 py-1">
                <Skeleton className="size-4 shrink-0 rounded-[4px]" />
                <Skeleton
                  className="h-4 max-w-full rounded-sm font-mono text-xs leading-4"
                  style={{ width: `${FILTER_VALUE_CHS[(group * 4 + row) % FILTER_VALUE_CHS.length]}ch` }}
                />
                <Skeleton className="ml-auto h-4 w-[2ch] rounded-sm" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function LogsFilters({ className }: { className?: string }) {
  const { facets, hasActiveFilters, resetFilters, isLoading } = useLogs()
  const showFacetSkeleton = isLoading && facets.length === 0

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
        {showFacetSkeleton
          ? <LogsFiltersSkeleton />
          : facets.map((facet, index) => (
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
