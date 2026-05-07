import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DateRangePicker } from '../../wrappers/date-range-picker'

describe('dateRangePicker', () => {
  it('renders the placeholder when value is null', () => {
    const { getByRole } = render(
      <DateRangePicker value={null} onChange={vi.fn()} placeholder="Pick a range" />,
    )
    expect(getByRole('combobox', { name: /pick a range/i })).toBeDefined()
  })

  it('renders the formatted range when a value is provided', () => {
    const { getByRole } = render(
      <DateRangePicker
        value={{ from: new Date(2026, 0, 15), to: new Date(2026, 0, 20) }}
        onChange={vi.fn()}
      />,
    )
    const trigger = getByRole('combobox')
    expect(trigger.textContent).toMatch(/Jan 15/)
    expect(trigger.textContent).toMatch(/Jan 20/)
  })

  it('opens the calendar when the trigger is clicked', () => {
    const { getByRole } = render(
      <DateRangePicker value={null} onChange={vi.fn()} placeholder="Pick a range" />,
    )
    fireEvent.click(getByRole('combobox', { name: /pick a range/i }))
    expect(document.body.querySelector('[data-slot="calendar"]')).not.toBeNull()
  })

  it('clear emits null', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <DateRangePicker
        value={{ from: new Date(2026, 0, 15), to: new Date(2026, 0, 20) }}
        onChange={onChange}
      />,
    )
    fireEvent.click(getByRole('button', { name: /clear/i }))
    expect(onChange).toHaveBeenCalledWith(null)
  })
})
