import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TimeRangePicker } from '../../wrappers/time-range-picker'

describe('timeRangePicker', () => {
  it('renders the placeholder when value is null', () => {
    const { getByRole } = render(
      <TimeRangePicker value={null} onChange={vi.fn()} placeholder="Pick a time range" />,
    )
    expect(getByRole('combobox', { name: /pick a time range/i })).toBeDefined()
  })

  it('renders the formatted range when a value is provided', () => {
    const { getByRole } = render(
      <TimeRangePicker
        value={{ from: '09:00', to: '17:00' }}
        onChange={vi.fn()}
        hourCycle="24"
      />,
    )
    const trigger = getByRole('combobox')
    expect(trigger.textContent).toContain('09:00')
    expect(trigger.textContent).toContain('17:00')
  })

  it('opens two slot lists when the trigger is clicked', () => {
    const { getByRole } = render(
      <TimeRangePicker value={null} onChange={vi.fn()} step={60} />,
    )
    fireEvent.click(getByRole('combobox'))
    const options = document.body.querySelectorAll('[role="option"]')
    expect(options.length).toBeGreaterThan(40)
  })
})
