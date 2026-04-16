import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TimePicker } from '../time-picker'

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

describe('timePicker', () => {
  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    })
    window.matchMedia = originalMatchMedia
  })

  it('renders trigger with placeholder when no value', () => {
    render(<TimePicker placeholder="Select time" />)
    expect(screen.getByRole('combobox')).toHaveTextContent('Select time')
  })

  it('renders trigger with formatted time when value is set', () => {
    render(<TimePicker value="14:30" />)
    expect(screen.getByRole('combobox')).toHaveTextContent('2:30 PM')
  })

  it('opens dropdown with time slots on click', async () => {
    const user = userEvent.setup()
    render(<TimePicker step={60} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('option', { name: /12:00 PM/i })).toBeInTheDocument()
  })

  it('calls onChange when a time slot is selected', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<TimePicker onChange={onChange} step={60} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: '2:00 PM' }))
    expect(onChange).toHaveBeenCalledWith('14:00')
  })

  it('renders mobile sheet on mobile viewport', async () => {
    setViewport(500)
    const user = userEvent.setup()
    render(<TimePicker sheetTitle="Pick time" step={60} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('heading', { name: 'Pick time' })).toBeInTheDocument()
  })
})
