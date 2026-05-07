import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Picker } from '../../components/root'
import { PickerTimezoneIndicator } from '../../components/timezone-indicator'

describe('picker.TimezoneIndicator', () => {
  it('renders the timezone label for time-bearing modes', () => {
    const { getByText } = render(
      <Picker.Root mode="datetime" value={null} onChange={vi.fn()} timezone="UTC">
        <PickerTimezoneIndicator />
      </Picker.Root>,
    )
    expect(getByText(/UTC/)).toBeDefined()
  })

  it('returns null for date-only modes', () => {
    const { container } = render(
      <Picker.Root mode="date" value={null} onChange={vi.fn()}>
        <PickerTimezoneIndicator />
      </Picker.Root>,
    )
    expect(container.querySelector('[data-slot="picker-tz-indicator"]')).toBeNull()
  })

  it('returns null when hideTimezone is true', () => {
    const { container } = render(
      <Picker.Root mode="datetime" value={null} onChange={vi.fn()} hideTimezone>
        <PickerTimezoneIndicator />
      </Picker.Root>,
    )
    expect(container.querySelector('[data-slot="picker-tz-indicator"]')).toBeNull()
  })
})
