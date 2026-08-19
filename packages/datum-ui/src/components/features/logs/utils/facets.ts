import type { LogEntry, LogFacet, LogFilters } from '../types'
import { CANONICAL_FACET_NAMES, FACET_LABELS, SEVERITY_ORDER } from './constants'

function facetLabel(name: string): string {
  return FACET_LABELS[name] ?? name.replaceAll('_', ' ')
}

function compareFacetValues(name: string, a: string, b: string): number {
  if (name === 'severity') {
    const aIndex = SEVERITY_ORDER.indexOf(a as typeof SEVERITY_ORDER[number])
    const bIndex = SEVERITY_ORDER.indexOf(b as typeof SEVERITY_ORDER[number])
    const aRank = aIndex === -1 ? SEVERITY_ORDER.length : aIndex
    const bRank = bIndex === -1 ? SEVERITY_ORDER.length : bIndex
    if (aRank !== bRank)
      return aRank - bRank
  }
  return a.localeCompare(b)
}

function compareFacetNames(a: string, b: string): number {
  const aIndex = (CANONICAL_FACET_NAMES as readonly string[]).indexOf(a)
  const bIndex = (CANONICAL_FACET_NAMES as readonly string[]).indexOf(b)
  const aRank = aIndex === -1 ? CANONICAL_FACET_NAMES.length : aIndex
  const bRank = bIndex === -1 ? CANONICAL_FACET_NAMES.length : bIndex
  if (aRank !== bRank)
    return aRank - bRank
  return a.localeCompare(b)
}

export function facetsFromEntries(
  entries: readonly LogEntry[],
  names: readonly string[] = CANONICAL_FACET_NAMES,
): LogFacet[] {
  const allow = new Set(names)
  const counts = new Map<string, Map<string, number>>()

  for (const entry of entries) {
    for (const [name, value] of Object.entries(entry.labels)) {
      if (!value || !allow.has(name))
        continue
      let values = counts.get(name)
      if (!values) {
        values = new Map()
        counts.set(name, values)
      }
      values.set(value, (values.get(value) ?? 0) + 1)
    }
  }

  return [...counts.keys()]
    .sort(compareFacetNames)
    .map((name) => {
      const values = counts.get(name) ?? new Map()
      return {
        name,
        label: facetLabel(name),
        options: [...values.entries()]
          .sort(([a], [b]) => compareFacetValues(name, a, b))
          .map(([value, count]) => ({ value, count })),
      }
    })
}

export function filterEntries(
  entries: readonly LogEntry[],
  filters: LogFilters,
  search = '',
): LogEntry[] {
  const query = search.trim().toLowerCase()
  const active = Object.entries(filters).filter(([, values]) => values.length > 0)

  return entries.filter((entry) => {
    for (const [name, values] of active) {
      const label = entry.labels[name]
      if (!label || !values.includes(label))
        return false
    }
    if (query && !entry.line.toLowerCase().includes(query))
      return false
    return true
  })
}
