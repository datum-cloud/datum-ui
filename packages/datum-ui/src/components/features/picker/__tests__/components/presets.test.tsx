import type { PickerPreset } from '../../types'
import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PickerPresets } from '../../components/presets'
import { Picker } from '../../components/root'

const PRESETS: PickerPreset[] = [
  {
    key: 'today',
    label: 'Today',
    getRange: () => ({ from: new Date(2026, 0, 15), to: new Date(2026, 0, 15) }),
  },
  {
    key: 'last-7',
    label: 'Last 7 days',
    getRange: () => ({ from: new Date(2026, 0, 9), to: new Date(2026, 0, 15) }),
  },
]

describe('picker.Presets', () => {
  it('renders a button per preset', () => {
    const { getByRole } = render(
      <Picker.Root mode="date-range" value={null} onChange={vi.fn()} presets={PRESETS}>
        <PickerPresets />
      </Picker.Root>,
    )
    expect(getByRole('button', { name: 'Today' })).toBeDefined()
    expect(getByRole('button', { name: 'Last 7 days' })).toBeDefined()
  })

  it('clicking a preset calls onChange with the range and preset key', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Picker.Root mode="date-range" value={null} onChange={onChange} presets={PRESETS}>
        <PickerPresets />
      </Picker.Root>,
    )
    fireEvent.click(getByRole('button', { name: 'Today' }))
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ preset: 'today' }))
  })
})
