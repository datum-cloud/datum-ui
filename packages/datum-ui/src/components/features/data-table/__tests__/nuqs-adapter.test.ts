import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useNuqsAdapter } from '../adapters/nuqs-adapter'

// Mock nuqs before importing the adapter
const mockSetCoreState = vi.fn()
const mockSetFilterState = vi.fn()

function createQueryStatesMock() {
  let callCount = 0
  return () => {
    callCount++
    // First call = core state, second call = filter state
    if (callCount % 2 === 1) {
      return [
        { sort: '-department,name', q: 'hello', page: 1, size: 20 },
        mockSetCoreState,
      ]
    }
    return [
      { status: 'active' },
      mockSetFilterState,
    ]
  }
}

vi.mock('nuqs', () => ({
  parseAsString: { withDefault: (d: unknown) => d },
  parseAsInteger: { withDefault: (d: unknown) => d },
  useQueryStates: createQueryStatesMock(),
}))

describe('useNuqsAdapter', () => {
  it('reads core state from nuqs query params', () => {
    const { result } = renderHook(() => useNuqsAdapter())
    const state = result.current.read()

    expect(state.sorting).toEqual([
      { id: 'department', desc: true },
      { id: 'name', desc: false },
    ])
    expect(state.search).toBe('hello')
    expect(state.pageIndex).toBe(1)
    expect(state.pageSize).toBe(20)
  })

  it('reads filter state when filter parsers provided', () => {
    const { result } = renderHook(() =>
      useNuqsAdapter({
        filters: { status: 'mockParser' },
      }),
    )
    const state = result.current.read()
    expect(state.filters).toEqual({ status: 'active' })
  })

  it('writes core state back to nuqs', () => {
    const { result } = renderHook(() =>
      useNuqsAdapter({
        filters: { status: 'mockParser' },
      }),
    )

    result.current.write({
      sorting: [{ id: 'date', desc: true }],
      filters: { status: 'inactive' },
      search: 'test',
      pageIndex: 3,
      pageSize: 50,
    })

    expect(mockSetCoreState).toHaveBeenCalledWith({
      sort: '-date',
      q: 'test',
      page: 3,
      size: 50,
    })
    expect(mockSetFilterState).toHaveBeenCalledWith({ status: 'inactive' })
  })

  it('omits filters from read when no filter parsers provided', () => {
    const { result } = renderHook(() => useNuqsAdapter())
    const state = result.current.read()
    expect(state.filters).toBeUndefined()
  })
})
