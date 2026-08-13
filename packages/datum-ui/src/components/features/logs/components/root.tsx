'use client'

import type { LogsRootProps } from '../types'
import { useCallback, useMemo } from 'react'
import { cn } from '../../../../utils/cn'
import { useControllableState } from '../hooks/use-controllable-state'
import { LogsContext } from '../hooks/use-logs'
import { DEFAULT_LOG_COLUMNS } from '../utils/constants'
import { facetsFromEntries } from '../utils/facets'
import { histogramFromEntries } from '../utils/histogram'
import { filtersAreActive, lastThirtyMinutes } from '../utils/time-range'

export function LogsRoot({
  entries,
  facets,
  histogram,
  timeRange,
  defaultTimeRange,
  filters,
  defaultFilters,
  search,
  defaultSearch = '',
  live,
  defaultLive = false,
  selectedId,
  defaultSelectedId = null,
  isLoading = false,
  error,
  columns = DEFAULT_LOG_COLUMNS,
  onTimeRangeChange,
  onFiltersChange,
  onSearchChange,
  onLiveChange,
  onSelectedIdChange,
  onRefresh,
  onExport,
  className,
  children,
}: LogsRootProps) {
  const [currentTimeRange, setTimeRange] = useControllableState({
    value: timeRange,
    defaultValue: defaultTimeRange ?? lastThirtyMinutes(),
    onChange: onTimeRangeChange,
  })
  const [currentFilters, setFilters] = useControllableState({
    value: filters,
    defaultValue: defaultFilters ?? {},
    onChange: onFiltersChange,
  })
  const [currentSearch, setSearch] = useControllableState({
    value: search,
    defaultValue: defaultSearch,
    onChange: onSearchChange,
  })
  const [currentLive, setLive] = useControllableState({
    value: live,
    defaultValue: defaultLive,
    onChange: onLiveChange,
  })
  const [currentSelectedId, setSelectedId] = useControllableState({
    value: selectedId,
    defaultValue: defaultSelectedId,
    onChange: onSelectedIdChange,
  })

  const resolvedFacets = useMemo(
    () => facets ?? facetsFromEntries(entries),
    [facets, entries],
  )
  const resolvedHistogram = useMemo(
    () => histogram ?? histogramFromEntries(entries, currentTimeRange),
    [histogram, entries, currentTimeRange],
  )

  const selectedIndex = useMemo(
    () => entries.findIndex(entry => entry.id === currentSelectedId),
    [entries, currentSelectedId],
  )
  const selectedEntry = selectedIndex >= 0 ? entries[selectedIndex] ?? null : null

  const toggleFilterValue = useCallback((name: string, value: string) => {
    const current = currentFilters[name] ?? []
    const nextValues = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value]
    const next = { ...currentFilters }
    if (nextValues.length === 0)
      delete next[name]
    else
      next[name] = nextValues
    setFilters(next)
  }, [currentFilters, setFilters])

  const resetFilters = useCallback(() => {
    setFilters({})
  }, [setFilters])

  const selectPrevious = useCallback(() => {
    if (entries.length === 0)
      return
    if (selectedIndex <= 0)
      setSelectedId(entries[0]!.id)
    else
      setSelectedId(entries[selectedIndex - 1]!.id)
  }, [entries, selectedIndex, setSelectedId])

  const selectNext = useCallback(() => {
    if (entries.length === 0)
      return
    if (selectedIndex < 0)
      setSelectedId(entries[0]!.id)
    else if (selectedIndex < entries.length - 1)
      setSelectedId(entries[selectedIndex + 1]!.id)
  }, [entries, selectedIndex, setSelectedId])

  const value = useMemo(() => ({
    entries,
    facets: resolvedFacets,
    histogram: resolvedHistogram,
    timeRange: currentTimeRange,
    setTimeRange,
    filters: currentFilters,
    setFilters,
    toggleFilterValue,
    resetFilters,
    search: currentSearch,
    setSearch,
    live: currentLive,
    setLive,
    selectedId: currentSelectedId,
    setSelectedId,
    selectedEntry,
    selectedIndex,
    selectPrevious,
    selectNext,
    isLoading,
    error,
    columns,
    hasActiveFilters: filtersAreActive(currentFilters),
    onRefresh,
    onExport,
  }), [
    entries,
    resolvedFacets,
    resolvedHistogram,
    currentTimeRange,
    setTimeRange,
    currentFilters,
    setFilters,
    toggleFilterValue,
    resetFilters,
    currentSearch,
    setSearch,
    currentLive,
    setLive,
    currentSelectedId,
    setSelectedId,
    selectedEntry,
    selectedIndex,
    selectPrevious,
    selectNext,
    isLoading,
    error,
    columns,
    onRefresh,
    onExport,
  ])

  return (
    <LogsContext value={value}>
      <div data-slot="logs-root" className={cn('flex h-full min-h-0 w-full flex-col', className)}>
        {children}
      </div>
    </LogsContext>
  )
}
