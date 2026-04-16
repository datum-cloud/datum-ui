import type { OptionPickerGroup, OptionPickerOption } from '../types'
import { describe, expect, it } from 'vitest'
import { flattenOptions, isGroupedOptions } from '../types'

describe('optionPicker types', () => {
  it('detects grouped options by shape', () => {
    const flat: OptionPickerOption[] = [{ label: 'A', value: 'a' }]
    const grouped: OptionPickerGroup<OptionPickerOption>[] = [
      { label: 'Group', options: [{ label: 'A', value: 'a' }] },
    ]
    expect(isGroupedOptions(flat)).toBe(false)
    expect(isGroupedOptions(grouped)).toBe(true)
  })

  it('treats empty array as flat (not grouped)', () => {
    expect(isGroupedOptions([])).toBe(false)
  })

  it('flattens grouped options', () => {
    const grouped: OptionPickerGroup<OptionPickerOption>[] = [
      { label: 'G1', options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] },
      { label: 'G2', options: [{ label: 'C', value: 'c' }] },
    ]
    expect(flattenOptions(grouped)).toEqual([
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
      { label: 'C', value: 'c' },
    ])
  })

  it('returns flat options unchanged', () => {
    const flat: OptionPickerOption[] = [{ label: 'A', value: 'a' }]
    expect(flattenOptions(flat)).toEqual(flat)
  })
})
