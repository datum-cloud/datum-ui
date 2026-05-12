import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useNuqsAdapter } from '../adapters/nuqs-adapter'

// Mock nuqs with a parsers-keyed cache so `useQueryStates` returns the same
// [state, setter] tuple for the same parsers reference. This mirrors nuqs's
// real behavior closely enough to assert ref stability across renders, which
// is what issue #98 hinges on.

const stateCache = new Map<object, readonly [Record<string, unknown>, (next: Record<string, unknown>) => void]>()

function getStableTuple(parsers: Record<string, unknown>) {
  const cached = stateCache.get(parsers)
  if (cached)
    return cached
  // The mocked `withDefault` returns the default value directly, so
  // `parsers[key]` is already the default we want to expose as state.
  const state: Record<string, unknown> = {}
  for (const key of Object.keys(parsers)) {
    state[key] = parsers[key]
  }
  const setter = vi.fn()
  const tuple = [state, setter] as const
  stateCache.set(parsers, tuple)
  return tuple
}

function mockUseQueryStates(parsers: Record<string, unknown>) {
  return getStableTuple(parsers)
}

vi.mock('nuqs', () => ({
  parseAsString: { withDefault: (d: unknown) => d },
  parseAsInteger: { withDefault: (d: unknown) => d },
  useQueryStates: mockUseQueryStates,
}))

describe('useNuqsAdapter — ref stability (issue #98)', () => {
  it('returns the same StateAdapter ref across renders when called with no options', () => {
    const { result, rerender } = renderHook(() => useNuqsAdapter())
    const first = result.current
    rerender()
    rerender()
    expect(result.current).toBe(first)
  })

  it('returns the same StateAdapter ref across renders when called with empty filters', () => {
    const { result, rerender } = renderHook(() => useNuqsAdapter({}))
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
  })

  it('returns the same StateAdapter ref across renders when stable filters are supplied', () => {
    const stableFilters = { status: 'placeholder-parser' as unknown }
    const { result, rerender } = renderHook(() => useNuqsAdapter({ filters: stableFilters }))
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
  })
})
