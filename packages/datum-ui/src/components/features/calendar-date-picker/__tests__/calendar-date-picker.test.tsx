import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CalendarDatePicker } from '../calendar-date-picker'

const originalInnerWidth = window.innerWidth
const originalMatchMedia = window.matchMedia

function setViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  })
  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    const match = query.match(/min-width:\s*(\d+)px/)
    const min = match ? Number(match[1]) : 0
    return {
      matches: width >= min,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList
  })
}

// Use an empty date range so the placeholder is shown in the trigger button
const emptyDate = { from: undefined as unknown as Date, to: undefined as unknown as Date }

describe('calendarDatePicker — responsive', () => {
  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    })
    window.matchMedia = originalMatchMedia
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
