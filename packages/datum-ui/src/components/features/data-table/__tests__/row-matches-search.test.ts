import { describe, expect, it } from 'vitest'
import { rowMatchesSearch } from '../core/filter-engine'

interface Row { name: string, status: { label: string }, count: number }
const row: Row = { name: 'HTTP Proxies', status: { label: 'Near limit' }, count: 8 }

describe('rowMatchesSearch', () => {
  it('returns true for empty query', () => {
    expect(rowMatchesSearch(row, '', {})).toBe(true)
  })
  it('matches across all stringifiable values by default', () => {
    expect(rowMatchesSearch(row, 'proxies', {})).toBe(true)
    expect(rowMatchesSearch(row, '8', {})).toBe(true)
    expect(rowMatchesSearch(row, 'zzz', {})).toBe(false)
  })
  it('honors searchableColumns with dot paths', () => {
    expect(rowMatchesSearch(row, 'near', { searchableColumns: ['status.label'] })).toBe(true)
    expect(rowMatchesSearch(row, 'near', { searchableColumns: ['name'] })).toBe(false)
  })
  it('honors a custom searchFn', () => {
    expect(rowMatchesSearch(row, 'X', { searchFn: r => r.name.startsWith('HTTP') })).toBe(true)
  })
})
