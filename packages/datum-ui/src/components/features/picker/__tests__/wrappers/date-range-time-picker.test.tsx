import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DateRangeTimePicker } from '../../wrappers/date-range-time-picker'

describe('dateRangeTimePicker', () => {
  it('renders the placeholder when value is null', () => {
    const { getByRole } = render(
      <DateRangeTimePicker
        value={null}
        onChange={vi.fn()}
        placeholder="Pick a range with time"
        timezone="UTC"
      />,
    )
    expect(getByRole('combobox', { name: /pick a range with time/i })).toBeDefined()
  })

  it('renders formatted range when a value is provided', () => {
    const value = {
      from: '2026-01-15T09:00:00.000Z',
      to: '2026-01-20T17:00:00.000Z',
    }
    const { getByRole } = render(
      <DateRangeTimePicker
        value={value}
        onChange={vi.fn()}
        timezone="UTC"
        hourCycle="24"
      />,
    )
    const trigger = getByRole('combobox')
    expect(trigger.textContent).toMatch(/Jan 15/)
    expect(trigger.textContent).toMatch(/Jan 20/)
  })

  it('renders timezone indicator', () => {
    const { getByRole, getByText } = render(
      <DateRangeTimePicker value={null} onChange={vi.fn()} timezone="UTC" />,
    )
    fireEvent.click(getByRole('combobox'))
    expect(getByText(/UTC/)).toBeDefined()
  })
})
