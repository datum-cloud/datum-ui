import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DateTimePicker } from '../../wrappers/date-time-picker'

describe('dateTimePicker', () => {
  it('renders the placeholder when value is null', () => {
    const { getByRole } = render(
      <DateTimePicker value={null} onChange={vi.fn()} placeholder="Pick a date & time" timezone="UTC" />,
    )
    expect(getByRole('combobox', { name: /pick a date & time/i })).toBeDefined()
  })

  it('renders formatted datetime in the declared timezone', () => {
    const { getByRole } = render(
      <DateTimePicker
        value="2026-01-15T07:00:00.000Z"
        onChange={vi.fn()}
        timezone="UTC"
        hourCycle="24"
      />,
    )
    const trigger = getByRole('combobox')
    expect(trigger.textContent).toMatch(/Jan/)
    expect(trigger.textContent).toMatch(/15/)
    expect(trigger.textContent).toMatch(/07:00/)
  })

  it('renders timezone indicator by default', () => {
    const { getByRole, getByText } = render(
      <DateTimePicker value={null} onChange={vi.fn()} timezone="UTC" />,
    )
    fireEvent.click(getByRole('combobox'))
    expect(getByText(/UTC/)).toBeDefined()
  })

  it('hides timezone indicator when hideTimezone is true', () => {
    const { getByRole } = render(
      <DateTimePicker value={null} onChange={vi.fn()} timezone="UTC" hideTimezone />,
    )
    fireEvent.click(getByRole('combobox'))
    expect(document.body.querySelector('[data-slot="picker-tz-indicator"]')).toBeNull()
  })
})
