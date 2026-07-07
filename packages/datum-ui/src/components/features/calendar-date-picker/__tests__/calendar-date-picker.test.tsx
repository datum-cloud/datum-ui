import { resetViewport, setViewport } from '@test/viewport'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CalendarDatePicker } from '../calendar-date-picker'

// Use an empty date range so the placeholder is shown in the trigger button
const emptyDate = { from: undefined as unknown as Date, to: undefined as unknown as Date }

describe('calendarDatePicker — responsive', () => {
  afterEach(() => {
    resetViewport()
  })

  it('renders mobile sheet heading with placeholder as title on mobile viewport', async () => {
    setViewport(500)
    render(
      <CalendarDatePicker
        date={emptyDate}
        onDateSelect={vi.fn()}
        placeholder="Pick a date"
      />,
    )
    await userEvent.click(screen.getAllByRole('combobox')[0] as HTMLElement)
    expect(screen.getByRole('heading', { name: 'Pick a date' })).toBeInTheDocument()
  })

  it('uses sheetTitle over placeholder when provided', async () => {
    setViewport(500)
    render(
      <CalendarDatePicker
        date={emptyDate}
        onDateSelect={vi.fn()}
        placeholder="Pick a date"
        sheetTitle="Custom date title"
      />,
    )
    await userEvent.click(screen.getAllByRole('combobox')[0] as HTMLElement)
    expect(screen.getByRole('heading', { name: 'Custom date title' })).toBeInTheDocument()
  })

  it('stays as popover when responsive={false}', async () => {
    setViewport(500)
    render(
      <CalendarDatePicker
        date={emptyDate}
        onDateSelect={vi.fn()}
        placeholder="Pick a date"
        responsive={false}
      />,
    )
    await userEvent.click(screen.getAllByRole('combobox')[0] as HTMLElement)
    expect(screen.queryByRole('heading', { name: 'Pick a date' })).not.toBeInTheDocument()
  })

  it('falls back to "Pick a date" when no placeholder or sheetTitle', async () => {
    setViewport(500)
    render(
      <CalendarDatePicker
        date={emptyDate}
        onDateSelect={vi.fn()}
      />,
    )
    await userEvent.click(screen.getAllByRole('combobox')[0] as HTMLElement)
    expect(screen.getByRole('heading', { name: 'Pick a date' })).toBeInTheDocument()
  })
})

describe('calendarDatePicker — from-only value (BUG-140)', () => {
  afterEach(() => {
    resetViewport()
  })

  it('shows the selected date, not the placeholder, for a from-only value', () => {
    const fromOnly = { from: new Date(2026, 0, 15) } as unknown as {
      from: Date
      to: Date
    }
    render(
      <CalendarDatePicker
        date={fromOnly}
        onDateSelect={vi.fn()}
        placeholder="Pick a date"
      />,
    )
    const trigger = screen.getAllByRole('combobox')[0] as HTMLElement
    expect(trigger).toHaveTextContent('Jan 15, 2026')
    expect(trigger).not.toHaveTextContent('Pick a date')
  })
})
