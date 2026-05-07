import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DatePicker } from '../../wrappers/date-picker'

describe('datePicker', () => {
  it('renders the placeholder when value is null', () => {
    const { getByRole } = render(
      <DatePicker value={null} onChange={vi.fn()} placeholder="Pick a date" />,
    )
    expect(getByRole('combobox', { name: /pick a date/i })).toBeDefined()
  })

  it('opens the popover when the trigger is clicked', () => {
    const { getByRole } = render(
      <DatePicker value={null} onChange={vi.fn()} placeholder="Pick a date" />,
    )
    fireEvent.click(getByRole('combobox', { name: /pick a date/i }))
    expect(document.body.querySelector('[data-slot="calendar"]')).not.toBeNull()
  })

  it('emits a Date when the user selects a day in immediate mode', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <DatePicker value={null} onChange={onChange} placeholder="Pick a date" />,
    )
    fireEvent.click(getByRole('combobox', { name: /pick a date/i }))
    const day = document.body.querySelector('button[data-day]')! as HTMLElement
    fireEvent.click(day)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0]?.[0]).toBeInstanceOf(Date)
  })

  it('renders the formatted value when a Date is provided', () => {
    const { getByRole } = render(
      <DatePicker value={new Date(2026, 0, 15)} onChange={vi.fn()} />,
    )
    const trigger = getByRole('combobox')
    expect(trigger.textContent).toMatch(/Jan/)
    expect(trigger.textContent).toMatch(/15/)
  })

  it('clear button emits null', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <DatePicker value={new Date(2026, 0, 15)} onChange={onChange} />,
    )
    fireEvent.click(getByRole('button', { name: /clear/i }))
    expect(onChange).toHaveBeenCalledWith(null)
  })
})
