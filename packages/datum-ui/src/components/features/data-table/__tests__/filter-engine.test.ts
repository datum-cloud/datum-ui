import { describe, expect, it } from 'vitest'
import { applyFilters, FILTER_STRATEGIES, resolvePath } from '../core/filter-engine'

describe('resolvePath', () => {
  const obj = {
    name: 'Alice',
    status: { state: 'Active', registrationApproval: 'Approved' },
    metadata: { labels: { env: 'prod' } },
  }

  it('resolves flat key', () => {
    expect(resolvePath(obj, 'name')).toBe('Alice')
  })

  it('resolves one-level dot path', () => {
    expect(resolvePath(obj, 'status.state')).toBe('Active')
  })

  it('resolves two-level dot path', () => {
    expect(resolvePath(obj, 'metadata.labels.env')).toBe('prod')
  })

  it('returns undefined for missing flat key', () => {
    expect(resolvePath(obj, 'missing')).toBeUndefined()
  })

  it('returns undefined for missing nested path', () => {
    expect(resolvePath(obj, 'status.missing.deep')).toBeUndefined()
  })

  it('returns undefined for null/undefined input', () => {
    expect(resolvePath(null, 'foo')).toBeUndefined()
    expect(resolvePath(undefined, 'bar')).toBeUndefined()
  })
})

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

  describe('nested dot-path data', () => {
    const nestedData = [
      { id: '1', metadata: { name: 'alice' }, status: { state: 'Active', approval: 'Approved' } },
      { id: '2', metadata: { name: 'bob' }, status: { state: 'Inactive', approval: 'Pending' } },
      { id: '3', metadata: { name: 'charlie' }, status: { state: 'Active', approval: 'Pending' } },
    ]

    it('applies select filter on nested dot-path column', () => {
      const registered = new Map([['status.state', 'select' as const]])
      const result = applyFilters(nestedData, { 'status.state': 'Active' }, '', registered, {}, {})
      expect(result).toHaveLength(2)
      expect(result.map(r => r.id)).toEqual(['1', '3'])
    })

    it('applies checkbox filter on nested dot-path column', () => {
      const registered = new Map([['status.approval', 'checkbox' as const]])
      const result = applyFilters(nestedData, { 'status.approval': ['Pending'] }, '', registered, {}, {})
      expect(result).toHaveLength(2)
      expect(result.map(r => r.id)).toEqual(['2', '3'])
    })

    it('combines nested filters', () => {
      const registered = new Map<string, 'select' | 'checkbox'>([
        ['status.state', 'select'],
        ['status.approval', 'checkbox'],
      ])
      const result = applyFilters(
        nestedData,
        { 'status.state': 'Active', 'status.approval': ['Pending'] },
        '',
        registered,
        {},
        {},
      )
      expect(result).toHaveLength(1)
      expect(result[0]!.id).toBe('3')
    })

    it('searches nested dot-path searchableColumns', () => {
      const result = applyFilters(nestedData, {}, 'bob', new Map(), {}, { searchableColumns: ['metadata.name'] })
      expect(result).toHaveLength(1)
      expect(result[0]!.id).toBe('2')
    })
  })
})
