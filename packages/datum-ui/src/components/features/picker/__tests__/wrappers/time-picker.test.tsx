import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TimePicker } from '../../wrappers/time-picker'

describe('timePicker', () => {
  it('renders the placeholder when value is null', () => {
    const { getByRole } = render(
      <TimePicker value={null} onChange={vi.fn()} placeholder="Pick a time" />,
    )
    expect(getByRole('combobox', { name: /pick a time/i })).toBeDefined()
  })

  it('renders the formatted value when a time string is provided', () => {
    const { getByRole } = render(
      <TimePicker value="14:30" onChange={vi.fn()} hourCycle="24" />,
    )
    expect(getByRole('combobox').textContent).toContain('14:30')
  })

  it('emits HH:mm when a slot is clicked', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <TimePicker value={null} onChange={onChange} step={60} />,
    )
    fireEvent.click(getByRole('combobox'))
    const slots = document.body.querySelectorAll('[role="option"]')
    const slot = slots[10] as HTMLElement
    fireEvent.click(slot)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0]?.[0]).toMatch(/^\d{2}:\d{2}$/)
  })
})
