import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useGroupedExpansion } from '../use-grouped-expansion'

const groups = [
  { id: 'a', title: 'A', rows: [] },
  { id: 'b', title: 'B', rows: [] },
]

describe('useGroupedExpansion', () => {
  it('opens all by default (\'all\')', () => {
    const { result } = renderHook(() => useGroupedExpansion(groups, {}))
    expect(result.current.isOpen('a')).toBe(true)
    expect(result.current.isOpen('b')).toBe(true)
  })

  it('opens none for \'none\'', () => {
    const { result } = renderHook(() => useGroupedExpansion(groups, { defaultExpanded: 'none' }))
    expect(result.current.isOpen('a')).toBe(false)
  })

  it('opens only listed ids for string[]', () => {
    const { result } = renderHook(() => useGroupedExpansion(groups, { defaultExpanded: ['b'] }))
    expect(result.current.isOpen('a')).toBe(false)
    expect(result.current.isOpen('b')).toBe(true)
  })

  it('per-group defaultOpen overrides the table default', () => {
    const g = [{ id: 'a', title: 'A', rows: [], defaultOpen: false }, { id: 'b', title: 'B', rows: [] }]
    const { result } = renderHook(() => useGroupedExpansion(g, { defaultExpanded: 'all' }))
    expect(result.current.isOpen('a')).toBe(false)
    expect(result.current.isOpen('b')).toBe(true)
  })

  it('toggles in uncontrolled mode and notifies', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useGroupedExpansion(groups, { defaultExpanded: 'none', onExpandedChange: onChange }))
    act(() => result.current.toggle('a'))
    expect(result.current.isOpen('a')).toBe(true)
    expect(onChange).toHaveBeenCalledWith(['a'])
  })

  it('opens async-arriving groups under defaultExpanded=all', () => {
    const initial = [{ id: 'a', title: 'A', rows: [] }]
    const { result, rerender } = renderHook(
      ({ g }) => useGroupedExpansion(g, { defaultExpanded: 'all' }),
      { initialProps: { g: initial } },
    )
    expect(result.current.isOpen('a')).toBe(true)
    rerender({ g: [...initial, { id: 'b', title: 'B', rows: [] }] })
    expect(result.current.isOpen('b')).toBe(true) // newly-arrived group inherits 'all'
  })

  it('controlled mode reflects expanded prop and does not self-update', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useGroupedExpansion(groups, { expanded: ['a'], onExpandedChange: onChange }))
    expect(result.current.isOpen('a')).toBe(true)
    act(() => result.current.toggle('a'))
    expect(onChange).toHaveBeenCalledWith([]) // asks parent to close
    expect(result.current.isOpen('a')).toBe(true) // still open until parent updates the prop
  })
})
