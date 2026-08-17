import type { Row, SortingState } from '@tanstack/react-table'

function compare(a: unknown, b: unknown): number {
  if (a == null && b == null)
    return 0
  if (a == null)
    return -1
  if (b == null)
    return 1
  if (typeof a === 'number' && typeof b === 'number')
    return a - b
  return String(a).localeCompare(String(b))
}

/**
 * Sort a single group's rows by the active sort (first entry; v1 is single-sort).
 * Returns the same reference when there is no sort, so React can skip re-renders.
 */
export function sortRows<TData>(rows: Row<TData>[], sorting: SortingState): Row<TData>[] {
  if (sorting.length === 0)
    return rows
  const { id, desc } = sorting[0]!
  const direction = desc ? -1 : 1
  // Apply direction inside the comparator (rather than reverse()ing afterward) so
  // tied rows keep their original relative order in both directions — reverse()
  // would flip equal-key rows and cause visible jitter on sort-direction toggle.
  return [...rows].sort((ra, rb) => direction * compare(ra.getValue(id), rb.getValue(id)))
}
