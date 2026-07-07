import type { Row } from '@tanstack/react-table'
import { describe, expect, it } from 'vitest'
import { sortRows } from '../lib/sort-rows'

// Minimal fake rows: sortRows only uses row.getValue(columnId).
function fakeRow<T extends Record<string, unknown>>(values: T): Row<unknown> {
  return { getValue: (id: string) => values[id] } as unknown as Row<unknown>
}

const rows = [
  fakeRow({ name: 'beta', n: 2 }),
  fakeRow({ name: 'alpha', n: 3 }),
  fakeRow({ name: 'gamma', n: 1 }),
]

describe('sortRows', () => {
  it('returns input unchanged when sorting is empty', () => {
    expect(sortRows(rows, [])).toBe(rows)
  })
  it('sorts ascending by string column', () => {
    const out = sortRows(rows, [{ id: 'name', desc: false }])
    expect(out.map(r => r.getValue('name'))).toEqual(['alpha', 'beta', 'gamma'])
  })
  it('sorts descending by numeric column', () => {
    const out = sortRows(rows, [{ id: 'n', desc: true }])
    expect(out.map(r => r.getValue('n'))).toEqual([3, 2, 1])
  })
  it('does not mutate the input array', () => {
    const copy = [...rows]
    sortRows(rows, [{ id: 'n', desc: false }])
    expect(rows).toEqual(copy)
  })

  it('keeps original order for tied keys when descending (stable sort)', () => {
    const tied = [
      fakeRow({ id: 'a', k: 1 }),
      fakeRow({ id: 'b', k: 1 }),
      fakeRow({ id: 'c', k: 1 }),
    ]
    const out = sortRows(tied, [{ id: 'k', desc: true }])
    // A reverse()-based descending sort would flip these to c, b, a.
    expect(out.map(r => r.getValue('id'))).toEqual(['a', 'b', 'c'])
  })
})
