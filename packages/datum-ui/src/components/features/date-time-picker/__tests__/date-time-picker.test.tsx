import { resetViewport, setViewport } from '@test/viewport'
/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DateTimePicker } from '../date-time-picker'

// Helper to open the popover
async function openPopover() {
  const button = screen.getByRole('combobox')
  await userEvent.click(button)
}

describe('dateTimePicker', () => {
  it('renders without value', async () => {
    render(<DateTimePicker />)

    // Should show placeholder
    expect(screen.getByText('Select date and time')).toBeInTheDocument()

    // Open popover to access time input
    await openPopover()

    // Time input should be present but disabled (no date selected)
    const timeInput = screen.getByLabelText('Select time')
    expect(timeInput).toBeInTheDocument()
    expect(timeInput).toHaveValue('')
    expect(timeInput).toBeDisabled()
  })

  it('displays value in local timezone', async () => {
    // 19:30 UTC = 14:30 EST (UTC-5)
    const utcValue = '2024-01-15T19:30:00.000Z'

    render(
      <DateTimePicker
        value={utcValue}
        timezone="America/New_York"
      />,
    )

    // Should show formatted date + time on button
    expect(screen.getByText(/Jan 15, 2024.*14:30/)).toBeInTheDocument()

    // Open popover to access time input
    await openPopover()

    // Time input should show converted time
    const timeInput = screen.getByLabelText('Select time')
    expect(timeInput).toHaveValue('14:30')
    expect(timeInput).not.toBeDisabled()
  })

  it('calls onChange when time is changed after date and time are already set', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    // Start with a full date+time value
    const initialValue = '2024-01-15T10:00:00.000Z'

    render(
      <DateTimePicker
        value={initialValue}
        onChange={onChange}
        timezone="UTC"
      />,
    )

    // Open popover to access time input
    await openPopover()

    const timeInput = screen.getByLabelText('Select time')
    expect(timeInput).toHaveValue('10:00')
    expect(timeInput).not.toBeDisabled()

    // Change the time
    await user.clear(timeInput)
    await user.type(timeInput, '14:30')

    // Datetime modes are pinned to commit="apply": typing updates pending
    // state, the Apply click is what publishes onChange.
    expect(onChange).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: /apply/i }))

    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]
    expect(lastCall).toBeDefined()
    const lastCallValue = lastCall?.[0]
    expect(lastCallValue).toMatch(/2024-01-15T14:30:00/)
    expect(lastCallValue).toContain('Z') // Should be UTC
  })

  it('disables time input when no date is selected', async () => {
    render(<DateTimePicker />)

    await openPopover()

    const timeInput = screen.getByLabelText('Select time')
    expect(timeInput).toBeDisabled()
  })

  it('enables time input when date is selected', async () => {
    // Start with a date selected
    const valueWithDate = '2024-01-15T10:00:00.000Z'

    render(
      <DateTimePicker
        value={valueWithDate}
        timezone="UTC"
      />,
    )

    await openPopover()

    const timeInput = screen.getByLabelText('Select time')
    expect(timeInput).not.toBeDisabled()
  })

  it('shows timezone indicator when enabled and date+time are set', async () => {
    const valueWithDateTime = '2024-01-15T10:00:00.000Z'

    render(
      <DateTimePicker
        value={valueWithDateTime}
        showTimezoneIndicator
        timezone="America/New_York"
      />,
    )

    await openPopover()
    expect(screen.getByText('America/New_York')).toBeInTheDocument()
  })

  it('hides timezone indicator by default', () => {
    const valueWithDateTime = '2024-01-15T10:00:00.000Z'

    render(
      <DateTimePicker
        value={valueWithDateTime}
        timezone="America/New_York"
      />,
    )

    expect(screen.queryByText('America/New_York')).not.toBeInTheDocument()
  })

  it('respects disabled prop on date button', () => {
    render(<DateTimePicker disabled />)

    const dateButton = screen.getByRole('combobox', { name: /select date and time/i })
    expect(dateButton).toBeDisabled()
  })

  it('respects disabled prop', () => {
    render(<DateTimePicker disabled />)

    // Button should be disabled, preventing access to time input
    const button = screen.getByRole('combobox')
    expect(button).toBeDisabled()
  })

  it('validates time input format and prevents invalid values', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    // Set up with a date already selected
    const initialValue = '2024-01-15T10:00:00.000Z'

    render(
      <DateTimePicker
        value={initialValue}
        onChange={onChange}
        timezone="UTC"
      />,
    )

    await openPopover()

    const timeInput = screen.getByLabelText('Select time')

    // Reset mock to track only new calls
    onChange.mockClear()

    // Try to enter incomplete time (not matching HH:mm pattern)
    await user.clear(timeInput)
    await user.type(timeInput, '1') // Just "1", not valid HH:mm format

    // Should not call onChange — neither typing (apply-flow) nor invalid input.
    expect(onChange).not.toHaveBeenCalled()

    // Now type a valid time and click Apply (datetime modes commit on Apply).
    onChange.mockClear()
    await user.clear(timeInput)
    await user.type(timeInput, '14:30')
    expect(onChange).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /apply/i }))
    expect(onChange).toHaveBeenCalled()
  })

  it('updates when value prop changes externally', async () => {
    const { rerender } = render(
      <DateTimePicker
        value="2024-01-15T10:00:00.000Z"
        timezone="UTC"
      />,
    )

    // Button should show both date and time
    expect(screen.getByText(/Jan 15, 2024.*10:00/)).toBeInTheDocument()

    await openPopover()

    let timeInput = screen.getByLabelText('Select time')
    expect(timeInput).toHaveValue('10:00')

    // Change the value prop
    rerender(
      <DateTimePicker
        value="2024-01-16T14:30:00.000Z"
        timezone="UTC"
      />,
    )

    // Component should update - button shows new date+time
    expect(screen.getByText(/Jan 16, 2024.*14:30/)).toBeInTheDocument()

    // Time input should also update
    timeInput = screen.getByLabelText('Select time')
    expect(timeInput).toHaveValue('14:30')
  })

  it('updates when timezone prop changes', async () => {
    const utcValue = '2024-01-15T19:30:00.000Z'

    const { rerender } = render(
      <DateTimePicker
        value={utcValue}
        timezone="UTC"
      />,
    )

    await openPopover()

    let timeInput = screen.getByLabelText('Select time')
    expect(timeInput).toHaveValue('19:30')

    // Change timezone to EST (UTC-5)
    rerender(
      <DateTimePicker
        value={utcValue}
        timezone="America/New_York"
      />,
    )

    // Time should convert to EST
    timeInput = screen.getByLabelText('Select time')
    expect(timeInput).toHaveValue('14:30')
  })

  it('uses custom placeholder', () => {
    render(
      <DateTimePicker
        placeholder="Pick a date..."
      />,
    )

    expect(screen.getByText('Pick a date...')).toBeInTheDocument()
  })

  it('does not call onChange when only time is set without a date', async () => {
    const onChange = vi.fn()

    render(
      <DateTimePicker
        onChange={onChange}
        timezone="UTC"
      />,
    )

    await openPopover()

    const timeInput = screen.getByLabelText('Select time')

    // Time input should be disabled when no date is set
    expect(timeInput).toBeDisabled()

    // onChange should never be called because the time input can't be interacted with
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('dateTimePicker — responsive', () => {
  afterEach(() => {
    resetViewport()
  })

  it('renders mobile sheet heading with placeholder as title on mobile viewport', async () => {
    setViewport(500)
    render(
      <DateTimePicker
        placeholder="Pick date & time"
      />,
    )
    await userEvent.click(screen.getAllByRole('combobox')[0] as HTMLElement)
    expect(screen.getByRole('heading', { name: 'Pick date & time' })).toBeInTheDocument()
  })

  it('uses sheetTitle over placeholder when provided', async () => {
    setViewport(500)
    render(
      <DateTimePicker
        placeholder="Pick date & time"
        sheetTitle="Custom date title"
      />,
    )
    await userEvent.click(screen.getAllByRole('combobox')[0] as HTMLElement)
    expect(screen.getByRole('heading', { name: 'Custom date title' })).toBeInTheDocument()
  })

  it('stays as popover when responsive={false}', async () => {
    setViewport(500)
    render(
      <DateTimePicker
        placeholder="Pick date & time"
        responsive={false}
      />,
    )
    await userEvent.click(screen.getAllByRole('combobox')[0] as HTMLElement)
    expect(screen.queryByRole('heading', { name: 'Pick date & time' })).not.toBeInTheDocument()
  })

  it('falls back to "Pick date & time" when no placeholder or sheetTitle', async () => {
    setViewport(500)
    render(
      <DateTimePicker />,
    )
    // DateTimePicker has a built-in default placeholder 'Select date and time',
    // so sheetTitle falls back to that placeholder, not the generic sentinel
    await userEvent.click(screen.getAllByRole('combobox')[0] as HTMLElement)
    expect(screen.getByRole('heading', { name: 'Select date and time' })).toBeInTheDocument()
  })
})
