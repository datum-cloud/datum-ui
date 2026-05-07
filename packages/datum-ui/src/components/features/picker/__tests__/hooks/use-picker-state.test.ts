import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { usePickerState } from '../../hooks/use-picker-state'

describe('usePickerState — date mode', () => {
  it('initializes with the provided value', () => {
    const value = new Date(2026, 0, 15)
    const { result } = renderHook(() =>
      usePickerState({ mode: 'date', value, onChange: vi.fn(), timezone: 'UTC' }),
    )
    expect(result.current.state.pendingValue).toEqual(value)
    expect(result.current.state.open).toBe(false)
  })

  it('setSingleDate + commit fires onChange and closes', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePickerState({ mode: 'date', value: null, onChange, commit: 'immediate', timezone: 'UTC' }),
    )
    const newDate = new Date(2026, 0, 15)
    act(() => result.current.actions.setSingleDate(newDate))
    expect(onChange).toHaveBeenCalledWith(newDate)
    expect(result.current.state.open).toBe(false)
  })

  it('open / close toggles state.open', () => {
    const { result } = renderHook(() =>
      usePickerState({ mode: 'date', value: null, onChange: vi.fn(), timezone: 'UTC' }),
    )
    act(() => result.current.actions.open())
    expect(result.current.state.open).toBe(true)
    act(() => result.current.actions.close())
    expect(result.current.state.open).toBe(false)
  })
})

describe('usePickerState — date-range mode (commit=apply)', () => {
  it('setRange holds in pending state without firing onChange', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePickerState({ mode: 'date-range', value: null, onChange, commit: 'apply', timezone: 'UTC' }),
    )
    const range = { from: new Date(2026, 0, 1), to: new Date(2026, 0, 7) }
    act(() => result.current.actions.setRange(range))
    expect(result.current.state.pendingValue).toEqual(range)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('apply fires onChange with the pending value and closes', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePickerState({ mode: 'date-range', value: null, onChange, commit: 'apply', timezone: 'UTC' }),
    )
    const range = { from: new Date(2026, 0, 1), to: new Date(2026, 0, 7) }
    // Two separate acts: matches realistic UX where the user clicks the
    // calendar (one event) and later clicks Apply (a separate event), with
    // a render in between. React batches dispatches inside one act, so
    // calling setRange and apply synchronously would have apply read stale
    // closure state.
    act(() => result.current.actions.setRange(range))
    act(() => result.current.actions.apply())
    expect(onChange).toHaveBeenCalledWith(range)
    expect(result.current.state.open).toBe(false)
  })

  it('reset returns pendingValue to the prop value', () => {
    const initial = { from: new Date(2026, 0, 1), to: new Date(2026, 0, 5) }
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePickerState({ mode: 'date-range', value: initial, onChange, commit: 'apply', timezone: 'UTC' }),
    )
    const newRange = { from: new Date(2026, 0, 10), to: new Date(2026, 0, 15) }
    act(() => result.current.actions.setRange(newRange))
    expect(result.current.state.pendingValue).toEqual(newRange)
    act(() => result.current.actions.reset())
    expect(result.current.state.pendingValue).toEqual(initial)
  })

  it('cancel returns pendingValue to prop AND closes', () => {
    const initial = { from: new Date(2026, 0, 1), to: new Date(2026, 0, 5) }
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePickerState({ mode: 'date-range', value: initial, onChange, commit: 'apply', timezone: 'UTC' }),
    )
    act(() => result.current.actions.open())
    act(() => result.current.actions.setRange({ from: new Date(2026, 0, 10), to: new Date(2026, 0, 15) }))
    act(() => result.current.actions.cancel())
    expect(result.current.state.pendingValue).toEqual(initial)
    expect(result.current.state.open).toBe(false)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('selectPreset always commits immediately, regardless of commit mode', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePickerState({ mode: 'date-range', value: null, onChange, commit: 'apply', timezone: 'UTC' }),
    )
    const range = { from: new Date(2026, 0, 1), to: new Date(2026, 0, 7) }
    act(() => result.current.actions.selectPreset(range, 'last-7-days'))
    expect(onChange).toHaveBeenCalledWith({ ...range, preset: 'last-7-days' })
    expect(result.current.state.open).toBe(false)
    expect(result.current.state.selectedPresetKey).toBe('last-7-days')
  })
})

describe('usePickerState — clear', () => {
  it('emits null and resets selected preset', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePickerState({ mode: 'date-range', value: null, onChange, timezone: 'UTC' }),
    )
    act(() => result.current.actions.clear())
    expect(onChange).toHaveBeenCalledWith(null)
    expect(result.current.state.selectedPresetKey).toBeUndefined()
  })
})

describe('usePickerState — selectPreset value-shape conversion', () => {
  // Real UTC instants — getRange(tz) returns Dates whose .toISOString() is the
  // canonical instant; presetValueForMode is responsible for projecting them
  // into each mode's emitted shape.
  const fromInstant = new Date(Date.UTC(2026, 0, 1, 7, 0)) // 2026-01-01T07:00:00Z
  const toInstant = new Date(Date.UTC(2026, 0, 1, 11, 30)) // 2026-01-01T11:30:00Z

  it('datetime-range emits ISO strings via .toISOString()', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePickerState({ mode: 'datetime-range', value: null, onChange, timezone: 'UTC' }),
    )
    act(() => result.current.actions.selectPreset({ from: fromInstant, to: toInstant }, 'last-1h'))
    expect(onChange).toHaveBeenCalledWith({
      from: '2026-01-01T07:00:00.000Z',
      to: '2026-01-01T11:30:00.000Z',
      preset: 'last-1h',
    })
  })

  it('date-range-time emits ISO strings via .toISOString()', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      usePickerState({ mode: 'date-range-time', value: null, onChange, timezone: 'UTC' }),
    )
    act(() => result.current.actions.selectPreset({ from: fromInstant, to: toInstant }, 'last-7-days'))
    expect(onChange).toHaveBeenCalledWith({
      from: '2026-01-01T07:00:00.000Z',
      to: '2026-01-01T11:30:00.000Z',
      preset: 'last-7-days',
    })
  })

  it('time-range projects instants to the active tz wall-clock HH:mm', () => {
    const onChange = vi.fn()
    // 07:00Z in Asia/Jakarta (UTC+7) is 14:00 wall-clock; 11:30Z is 18:30.
    const { result } = renderHook(() =>
      usePickerState({ mode: 'time-range', value: null, onChange, timezone: 'Asia/Jakarta' }),
    )
    act(() => result.current.actions.selectPreset({ from: fromInstant, to: toInstant }, 'morning'))
    expect(onChange).toHaveBeenCalledWith({ from: '14:00', to: '18:30', preset: 'morning' })
  })

  it('time-range honors a different tz on the same instants', () => {
    const onChange = vi.fn()
    // Same instants in UTC — wall-clock matches the UTC hours/minutes.
    const { result } = renderHook(() =>
      usePickerState({ mode: 'time-range', value: null, onChange, timezone: 'UTC' }),
    )
    act(() => result.current.actions.selectPreset({ from: fromInstant, to: toInstant }, 'morning'))
    expect(onChange).toHaveBeenCalledWith({ from: '07:00', to: '11:30', preset: 'morning' })
  })
})

describe('usePickerState — sync from prop', () => {
  it('updates pendingValue when value prop changes', () => {
    const onChange = vi.fn()
    const initial = new Date(2026, 0, 15)
    const next = new Date(2026, 0, 20)
    const { result, rerender } = renderHook(
      ({ value }) => usePickerState({ mode: 'date', value, onChange, timezone: 'UTC' }),
      { initialProps: { value: initial as Date | null } },
    )
    expect(result.current.state.pendingValue).toEqual(initial)
    rerender({ value: next })
    expect(result.current.state.pendingValue).toEqual(next)
  })
})
