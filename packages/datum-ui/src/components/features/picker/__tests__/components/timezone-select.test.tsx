import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Picker } from '../../components/root'
import { PickerTimezoneSelect } from '../../components/timezone-select'

describe('picker.TimezoneSelect', () => {
  it('renders the current timezone label by default', () => {
    const { getByRole } = render(
      <Picker.Root mode="datetime" value={null} onChange={vi.fn()} timezone="UTC">
        <PickerTimezoneSelect
          options={[
            { value: 'UTC', label: 'UTC' },
            { value: 'Asia/Jakarta', label: 'Asia/Jakarta' },
          ]}
          onChange={vi.fn()}
        />
      </Picker.Root>,
    )
    expect(getByRole('combobox')).toBeDefined()
  })

  it('returns null for date-only modes', () => {
    const { container } = render(
      <Picker.Root mode="date" value={null} onChange={vi.fn()}>
        <PickerTimezoneSelect
          options={[{ value: 'UTC', label: 'UTC' }]}
          onChange={vi.fn()}
        />
      </Picker.Root>,
    )
    expect(container.querySelector('[data-slot="picker-tz-select"]')).toBeNull()
  })
})
