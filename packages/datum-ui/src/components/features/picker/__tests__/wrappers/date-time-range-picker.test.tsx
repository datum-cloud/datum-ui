import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DateTimeRangePicker } from '../../wrappers/date-time-range-picker'

describe('dateTimeRangePicker', () => {
  it('renders the placeholder when value is null', () => {
    const { getByRole } = render(
      <DateTimeRangePicker
        value={null}
        onChange={vi.fn()}
        placeholder="Pick a range"
        timezone="UTC"
      />,
    )
    expect(getByRole('combobox', { name: /pick a range/i })).toBeDefined()
  })

  it('renders formatted range when a value is provided', () => {
    const value = {
      from: '2026-01-15T07:00:00.000Z',
      to: '2026-01-15T17:00:00.000Z',
    }
    const { getByRole } = render(
      <DateTimeRangePicker
        value={value}
        onChange={vi.fn()}
        timezone="UTC"
        hourCycle="24"
      />,
    )
    const trigger = getByRole('combobox')
    expect(trigger.textContent).toContain('07:00')
    expect(trigger.textContent).toContain('17:00')
  })

  it('renders timezone indicator on time-bearing range', () => {
    const { getByRole, getByText } = render(
      <DateTimeRangePicker value={null} onChange={vi.fn()} timezone="UTC" />,
    )
    fireEvent.click(getByRole('combobox'))
    expect(getByText(/UTC/)).toBeDefined()
  })
})
