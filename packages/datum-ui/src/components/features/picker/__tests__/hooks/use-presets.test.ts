import type { PickerPreset } from '../../types'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { usePresets } from '../../hooks/use-presets'

// `isDateDisabled(date) === true` means the date is REJECTED by constraints.
const constraintsAlwaysValid = () => false // no date is disabled — all valid
const constraintsBlockAll = () => true // every date is disabled — all blocked

describe('usePresets', () => {
  it('returns the default preset set for a mode when none is supplied', () => {
    const { result } = renderHook(() =>
      usePresets({
        mode: 'date-range',
        timezone: 'UTC',
        isDateDisabled: constraintsAlwaysValid,
      }),
    )
    expect(result.current.length).toBeGreaterThan(0)
  })

  it('returns the custom set when provided, ignoring defaults', () => {
    const custom: PickerPreset[] = [
      {
        key: 'just-now',
        label: 'Just now',
        getRange: () => ({ from: new Date(), to: new Date() }),
      },
    ]
    const { result } = renderHook(() =>
      usePresets({
        mode: 'date-range',
        timezone: 'UTC',
        custom,
        isDateDisabled: constraintsAlwaysValid,
      }),
    )
    expect(result.current).toEqual(custom)
  })

  it('filters presets by excludeKeys', () => {
    const { result } = renderHook(() =>
      usePresets({
        mode: 'date-range',
        timezone: 'UTC',
        excludeKeys: ['today', 'yesterday'],
        isDateDisabled: constraintsAlwaysValid,
      }),
    )
    expect(result.current.find(p => p.key === 'today')).toBeUndefined()
    expect(result.current.find(p => p.key === 'yesterday')).toBeUndefined()
  })

  it('filters presets whose range is disabled by date constraints', () => {
    const { result } = renderHook(() =>
      usePresets({
        mode: 'date-range',
        timezone: 'UTC',
        isDateDisabled: constraintsBlockAll,
      }),
    )
    expect(result.current).toEqual([])
  })

  it('returns empty for time-only modes by default', () => {
    const { result } = renderHook(() =>
      usePresets({
        mode: 'time',
        timezone: 'UTC',
        isDateDisabled: constraintsAlwaysValid,
      }),
    )
    expect(result.current).toEqual([])
  })
})
