import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useOptionPicker } from '../use-option-picker'

const opts = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]

describe('useOptionPicker — single mode', () => {
  it('initializes with controlled value selected', () => {
    const { result } = renderHook(() =>
      useOptionPicker({
        multiple: false,
        options: opts,
        value: 'apple',
        open: true,
        onOpenChange: () => {},
      }),
    )
    expect(result.current.isSelected('apple')).toBe(true)
    expect(result.current.isSelected('banana')).toBe(false)
    expect(result.current.hasSelection).toBe(true)
  })

  it('toggle emits a string and closes when closeOnSelect=true (default)', () => {
    const onValueChange = vi.fn()
    const onOpenChange = vi.fn()
    const { result } = renderHook(() =>
      useOptionPicker({
        multiple: false,
        options: opts,
        onValueChange,
        open: true,
        onOpenChange,
      }),
    )
    act(() => result.current.toggle('banana'))
    expect(onValueChange).toHaveBeenCalledWith('banana')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('toggle does not close when closeOnSelect=false', () => {
    const onOpenChange = vi.fn()
    const { result } = renderHook(() =>
      useOptionPicker({
        multiple: false,
        options: opts,
        closeOnSelect: false,
        open: true,
        onOpenChange,
      }),
    )
    act(() => result.current.toggle('banana'))
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('internally filters by substring when onSearchChange is not provided', () => {
    const { result } = renderHook(() =>
      useOptionPicker({
        multiple: false,
        options: opts,
        open: true,
        onOpenChange: () => {},
      }),
    )
    act(() => result.current.setSearch('an'))
    const filtered = result.current.filteredOptions as typeof opts
    expect(filtered.map(o => o.value)).toEqual(['banana'])
    expect(result.current.hasMatches).toBe(true)
  })

  it('does not filter internally when onSearchChange is provided', () => {
    const onSearchChange = vi.fn()
    const { result } = renderHook(() =>
      useOptionPicker({
        multiple: false,
        options: opts,
        open: true,
        onOpenChange: () => {},
        onSearchChange,
      }),
    )
    act(() => result.current.setSearch('an'))
    expect(onSearchChange).toHaveBeenCalledWith('an')
    const filtered = result.current.filteredOptions as typeof opts
    expect(filtered).toEqual(opts)
  })

  it('exposes creatableValue when search has no match and creatable=true', () => {
    const { result } = renderHook(() =>
      useOptionPicker({
        multiple: false,
        options: opts,
        creatable: true,
        open: true,
        onOpenChange: () => {},
      }),
    )
    act(() => result.current.setSearch('xyz'))
    expect(result.current.creatableValue).toBe('xyz')

    act(() => result.current.setSearch('apple'))
    expect(result.current.creatableValue).toBe(null)
  })

  it('suppresses creatableValue when search collides with an existing value (BUG-119)', () => {
    const collidingOpts = [{ label: 'Foo Bar', value: 'foo' }]
    const { result } = renderHook(() =>
      useOptionPicker({
        multiple: false,
        options: collidingOpts,
        creatable: true,
        open: true,
        onOpenChange: () => {},
      }),
    )
    act(() => result.current.setSearch('foo'))
    expect(result.current.creatableValue).toBe(null)
  })

  it('exposes selection and selectedOptions as the resolved read path (STRUCT-045)', () => {
    const { result } = renderHook(() =>
      useOptionPicker({
        multiple: true,
        options: opts,
        value: ['apple', 'cherry'],
        open: true,
        onOpenChange: () => {},
      }),
    )
    expect(result.current.selection).toEqual(['apple', 'cherry'])
    expect(result.current.selectedOptions).toEqual([
      { label: 'Apple', value: 'apple' },
      { label: 'Cherry', value: 'cherry' },
    ])
  })
})

describe('useOptionPicker — multi mode', () => {
  it('toggle adds/removes values and emits an array', () => {
    const onValueChange = vi.fn()
    const { result, rerender } = renderHook(
      ({ value }: { value: string[] }) =>
        useOptionPicker({
          multiple: true,
          options: opts,
          value,
          onValueChange,
          open: true,
          onOpenChange: () => {},
        }),
      { initialProps: { value: [] as string[] } },
    )
    act(() => result.current.toggle('apple'))
    expect(onValueChange).toHaveBeenLastCalledWith(['apple'])

    rerender({ value: ['apple'] })
    act(() => result.current.toggle('banana'))
    expect(onValueChange).toHaveBeenLastCalledWith(['apple', 'banana'])

    rerender({ value: ['apple', 'banana'] })
    act(() => result.current.toggle('apple'))
    expect(onValueChange).toHaveBeenLastCalledWith(['banana'])
  })

  it('clear emits an empty array', () => {
    const onValueChange = vi.fn()
    const { result } = renderHook(() =>
      useOptionPicker({
        multiple: true,
        options: opts,
        value: ['apple', 'banana'],
        onValueChange,
        open: true,
        onOpenChange: () => {},
      }),
    )
    act(() => result.current.clear())
    expect(onValueChange).toHaveBeenCalledWith([])
  })

  it('hasSelection reflects selected values', () => {
    const { result: empty } = renderHook(() =>
      useOptionPicker({
        multiple: true,
        options: opts,
        value: [],
        open: true,
        onOpenChange: () => {},
      }),
    )
    expect(empty.current.hasSelection).toBe(false)

    const { result: one } = renderHook(() =>
      useOptionPicker({
        multiple: true,
        options: opts,
        value: ['apple'],
        open: true,
        onOpenChange: () => {},
      }),
    )
    expect(one.current.hasSelection).toBe(true)
  })
})

describe('useOptionPicker — controllable state', () => {
  it('seeds from defaultValue and owns the value when uncontrolled (single)', () => {
    const onValueChange = vi.fn()
    const { result } = renderHook(() =>
      useOptionPicker({
        multiple: false,
        options: opts,
        defaultValue: 'apple',
        onValueChange,
        closeOnSelect: false,
        open: true,
        onOpenChange: () => {},
      }),
    )
    expect(result.current.isSelected('apple')).toBe(true)

    act(() => result.current.toggle('banana'))
    expect(onValueChange).toHaveBeenCalledWith('banana')
    // Uncontrolled: the hook owns the value, so selection updates without a value prop.
    expect(result.current.isSelected('banana')).toBe(true)
    expect(result.current.isSelected('apple')).toBe(false)
  })

  it('does not mutate selection internally when controlled (single)', () => {
    const onValueChange = vi.fn()
    const { result } = renderHook(() =>
      useOptionPicker({
        multiple: false,
        options: opts,
        value: 'apple',
        onValueChange,
        closeOnSelect: false,
        open: true,
        onOpenChange: () => {},
      }),
    )
    act(() => result.current.toggle('banana'))
    expect(onValueChange).toHaveBeenCalledWith('banana')
    // Controlled: the parent owns the value; internal selection stays put.
    expect(result.current.isSelected('apple')).toBe(true)
    expect(result.current.isSelected('banana')).toBe(false)
  })

  it('seeds from defaultValue and toggles/clears internally when uncontrolled (multi)', () => {
    const onValueChange = vi.fn()
    const { result } = renderHook(() =>
      useOptionPicker({
        multiple: true,
        options: opts,
        defaultValue: ['apple'],
        onValueChange,
        open: true,
        onOpenChange: () => {},
      }),
    )
    expect(result.current.selection).toEqual(['apple'])

    act(() => result.current.toggle('banana'))
    expect(onValueChange).toHaveBeenLastCalledWith(['apple', 'banana'])
    expect(result.current.selection).toEqual(['apple', 'banana'])

    act(() => result.current.clear())
    expect(onValueChange).toHaveBeenLastCalledWith([])
    expect(result.current.selection).toEqual([])
  })

  it('does not mutate selection internally when controlled (multi)', () => {
    const onValueChange = vi.fn()
    const { result } = renderHook(() =>
      useOptionPicker({
        multiple: true,
        options: opts,
        value: ['apple'],
        onValueChange,
        open: true,
        onOpenChange: () => {},
      }),
    )
    act(() => result.current.toggle('banana'))
    expect(onValueChange).toHaveBeenLastCalledWith(['apple', 'banana'])
    // Controlled: internal selection stays at the controlled value until the parent updates it.
    expect(result.current.selection).toEqual(['apple'])
  })
})

describe('useOptionPicker — grouped options', () => {
  const grouped = [
    { label: 'Fruit', options: [{ label: 'Apple', value: 'apple' }] },
    { label: 'Veg', options: [{ label: 'Broccoli', value: 'broccoli' }] },
  ]

  it('filters grouped options by substring and preserves groups', () => {
    const { result } = renderHook(() =>
      useOptionPicker({
        multiple: false,
        options: grouped,
        open: true,
        onOpenChange: () => {},
      }),
    )
    act(() => result.current.setSearch('apple'))
    const filtered = result.current.filteredOptions as typeof grouped
    expect(filtered).toEqual([{ label: 'Fruit', options: [{ label: 'Apple', value: 'apple' }] }])
  })
})
