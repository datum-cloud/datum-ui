import { describe, expect, it } from 'vitest'
import { applyFilters, FILTER_STRATEGIES } from '../core/filter-engine'

describe('fILTER_STRATEGIES', () => {
  describe('checkbox', () => {
    const strategy = FILTER_STRATEGIES.checkbox

    it('returns true when filterValue is empty array', () => {
      expect(strategy('Engineering', [])).toBe(true)
    })

    it('returns true when filterValue is null', () => {
      expect(strategy('Engineering', null)).toBe(true)
    })

    it('returns true when cellValue is in filterValue array', () => {
      expect(strategy('Engineering', ['Engineering', 'Design'])).toBe(true)
    })

    it('returns false when cellValue is not in filterValue array', () => {
      expect(strategy('Marketing', ['Engineering', 'Design'])).toBe(false)
    })

    it('handles array cellValue with intersection check', () => {
      expect(strategy(['a', 'b'], ['b', 'c'])).toBe(true)
      expect(strategy(['a', 'b'], ['c', 'd'])).toBe(false)
    })
  })

  describe('select', () => {
    const strategy = FILTER_STRATEGIES.select

    it('returns true when filterValue is null', () => {
      expect(strategy('active', null)).toBe(true)
    })

    it('returns true when filterValue is empty string', () => {
      expect(strategy('active', '')).toBe(true)
    })

    it('returns true on exact match', () => {
      expect(strategy('active', 'active')).toBe(true)
    })

    it('returns false on mismatch', () => {
      expect(strategy('active', 'inactive')).toBe(false)
    })

    it('compares non-string values by identity', () => {
      expect(strategy(42, 42)).toBe(true)
      expect(strategy(42, 43)).toBe(false)
    })
  })

  describe('date-gte', () => {
    const strategy = FILTER_STRATEGIES['date-gte']

    it('returns true when filterValue is null', () => {
      expect(strategy('2024-01-01', null)).toBe(true)
    })

    it('returns true when cellDate >= filterDate', () => {
      expect(strategy('2024-06-01', '2024-01-01')).toBe(true)
    })

    it('returns false when cellDate < filterDate', () => {
      expect(strategy('2023-06-01', '2024-01-01')).toBe(false)
    })

    it('returns true on exact date match', () => {
      expect(strategy('2024-01-01', '2024-01-01')).toBe(true)
    })

    it('returns true when cellValue is invalid date', () => {
      expect(strategy('not-a-date', '2024-01-01')).toBe(true)
    })

    it('returns true when filterValue is invalid date', () => {
      expect(strategy('2024-01-01', 'not-a-date')).toBe(true)
    })
  })

  describe('date-lte', () => {
    const strategy = FILTER_STRATEGIES['date-lte']

    it('returns true when cellDate <= filterDate', () => {
      expect(strategy('2023-06-01', '2024-01-01')).toBe(true)
    })

    it('returns false when cellDate > filterDate', () => {
      expect(strategy('2024-06-01', '2024-01-01')).toBe(false)
    })

    it('returns true when either date is invalid', () => {
      expect(strategy('garbage', '2024-01-01')).toBe(true)
      expect(strategy('2024-01-01', 'garbage')).toBe(true)
    })
  })
})

describe('applyFilters', () => {
  const data = [
    { id: '1', name: 'Alice', department: 'Engineering', status: 'active', joinedAt: '2024-01-01' },
    { id: '2', name: 'Bob', department: 'Design', status: 'inactive', joinedAt: '2023-06-01' },
    { id: '3', name: 'Charlie', department: 'Engineering', status: 'active', joinedAt: '2024-06-01' },
    { id: '4', name: 'Diana', department: 'Marketing', status: 'pending', joinedAt: '2022-01-01' },
  ]

  it('returns all data when no filters and no search', () => {
    const result = applyFilters(data, {}, '', new Map(), {}, {})
    expect(result).toBe(data)
  })

  it('applies checkbox filter via registered strategy', () => {
    const registered = new Map([['department', 'checkbox' as const]])
    const result = applyFilters(data, { department: ['Engineering'] }, '', registered, {}, {})
    expect(result).toHaveLength(2)
    expect(result.map(r => r.name)).toEqual(['Alice', 'Charlie'])
  })

  it('applies select filter via registered strategy', () => {
    const registered = new Map([['status', 'select' as const]])
    const result = applyFilters(data, { status: 'active' }, '', registered, {}, {})
    expect(result).toHaveLength(2)
  })

  it('applies date-gte filter', () => {
    const registered = new Map([['joinedAt', 'date-gte' as const]])
    const result = applyFilters(data, { joinedAt: '2024-01-01' }, '', registered, {}, {})
    expect(result).toHaveLength(2)
  })

  it('custom filterFn overrides registered strategy', () => {
    const registered = new Map([['department', 'checkbox' as const]])
    const customFns = {
      department: (cellValue: unknown, filterValue: unknown) => cellValue === filterValue,
    }
    const result = applyFilters(data, { department: 'Engineering' }, '', registered, customFns, {})
    expect(result).toHaveLength(2)
  })

  it('applies global search with searchableColumns', () => {
    const result = applyFilters(data, {}, 'alice', new Map(), {}, { searchableColumns: ['name'] })
    expect(result).toHaveLength(1)
    expect(result[0]!.name).toBe('Alice')
  })

  it('applies global search with custom searchFn', () => {
    const searchFn = (row: typeof data[0], query: string) =>
      row.name.toLowerCase().startsWith(query.toLowerCase())
    const result = applyFilters(data, {}, 'ch', new Map(), {}, { searchFn })
    expect(result).toHaveLength(1)
    expect(result[0]!.name).toBe('Charlie')
  })

  it('combines column filters and search', () => {
    const registered = new Map([['department', 'checkbox' as const]])
    const result = applyFilters(data, { department: ['Engineering'] }, 'charlie', registered, {}, { searchableColumns: ['name'] })
    expect(result).toHaveLength(1)
    expect(result[0]!.name).toBe('Charlie')
  })

  it('handles unregistered column filter gracefully (skips it)', () => {
    const result = applyFilters(data, { unknownColumn: 'value' }, '', new Map(), {}, {})
    expect(result).toEqual(data)
  })
})
