import type { DefaultExpanded, GroupedTableGroup } from './types'
import { useCallback, useState } from 'react'

function defaultFor<TData>(group: GroupedTableGroup<TData>, def: DefaultExpanded): boolean {
  const fallback
    = def === 'all'
      ? true
      : def === 'none'
        ? false
        : Array.isArray(def) ? def.includes(group.id) : true
  return group.defaultOpen ?? fallback
}

export function useGroupedExpansion<TData>(
  groups: GroupedTableGroup<TData>[],
  opts: { defaultExpanded?: DefaultExpanded, expanded?: string[], onExpandedChange?: (ids: string[]) => void },
) {
  const { defaultExpanded = 'all', expanded, onExpandedChange } = opts
  const controlled = expanded !== undefined
  // Explicit user toggles only; groups not present here fall back to their default,
  // so async-arriving groups inherit `defaultExpanded` instead of being collapsed.
  const [overrides, setOverrides] = useState<Record<string, boolean>>({})

  const isOpen = useCallback((id: string): boolean => {
    if (controlled)
      return expanded!.includes(id)
    if (id in overrides)
      return overrides[id]!
    const g = groups.find(x => x.id === id)
    return g ? defaultFor(g, defaultExpanded) : false
  }, [controlled, expanded, overrides, groups, defaultExpanded])

  const toggle = useCallback((id: string) => {
    const now = isOpen(id)
    if (!controlled)
      setOverrides(o => ({ ...o, [id]: !now }))
    const next = groups.filter(g => (g.id === id ? !now : isOpen(g.id))).map(g => g.id)
    onExpandedChange?.(next)
  }, [controlled, groups, isOpen, onExpandedChange])

  return { isOpen, toggle }
}
