import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PickerCalendar } from '../../components/calendar'
import { Picker } from '../../components/root'

describe('picker.Calendar', () => {
  it('renders a calendar grid in date mode', () => {
    const { container } = render(
      <Picker.Root mode="date" value={new Date(2026, 0, 15)} onChange={vi.fn()}>
        <PickerCalendar />
      </Picker.Root>,
    )
    expect(container.querySelector('[data-slot="calendar"]')).not.toBeNull()
  })

  it('returns null for time-only modes', () => {
    const { container } = render(
      <Picker.Root mode="time" value={null} onChange={vi.fn()}>
        <PickerCalendar />
      </Picker.Root>,
    )
    expect(container.querySelector('[data-slot="calendar"]')).toBeNull()
  })

  it('renders a calendar grid in date-range mode', () => {
    const { container } = render(
      <Picker.Root
        mode="date-range"
        value={{ from: new Date(2026, 0, 1), to: new Date(2026, 0, 7) }}
        onChange={vi.fn()}
      >
        <PickerCalendar numberOfMonths={2} />
      </Picker.Root>,
    )
    expect(container.querySelector('[data-slot="calendar"]')).not.toBeNull()
  })
})
