import type { Row } from '@tanstack/react-table'
import { describe, expect, it } from 'vitest'
import { bucketRows } from '../lib/bucket-rows'

const row = (id: string) => ({ id } as Row<unknown>)
const groups = [
  { id: 'g1', rows: [{}, {}] },
  { id: 'g2', rows: [{}] },
]
// core rows in group-concatenated order: g1,g1,g2
const coreRows = [row('0'), row('1'), row('2')]

describe('bucketRows', () => {
  it('buckets all rows by group when nothing is filtered', () => {
    const out = bucketRows(groups, coreRows, coreRows)
    expect(out.get('g1')!.map(r => r.id)).toEqual(['0', '1'])
    expect(out.get('g2')!.map(r => r.id)).toEqual(['2'])
  })
  it('only places filtered rows into their group bucket', () => {
    const filtered = [row('1'), row('2')] // row 0 filtered out
    const out = bucketRows(groups, coreRows, filtered)
    expect(out.get('g1')!.map(r => r.id)).toEqual(['1'])
    expect(out.get('g2')!.map(r => r.id)).toEqual(['2'])
  })
})
