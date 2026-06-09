import type { Row } from '@tanstack/react-table'

interface GroupLike { id: string, rows: unknown[] }

/**
 * Build per-group buckets of `filteredRows`, preserving the filtered order.
 * `coreRows` are the unfiltered rows in group-concatenated order; we use their
 * positions to learn which row id belongs to which group, so bucketing is correct
 * regardless of a custom getRowId.
 */
export function bucketRows<TData>(
  groups: GroupLike[],
  coreRows: Row<TData>[],
  filteredRows: Row<TData>[],
): Map<string, Row<TData>[]> {
  const idToGroup = new Map<string, string>()
  let offset = 0
  for (const group of groups) {
    for (let i = 0; i < group.rows.length; i++) {
      const core = coreRows[offset + i]
      if (core)
        idToGroup.set(core.id, group.id)
    }
    offset += group.rows.length
  }

  const buckets = new Map<string, Row<TData>[]>(groups.map(g => [g.id, []]))
  for (const row of filteredRows) {
    const groupId = idToGroup.get(row.id)
    if (groupId)
      buckets.get(groupId)!.push(row)
  }
  return buckets
}
