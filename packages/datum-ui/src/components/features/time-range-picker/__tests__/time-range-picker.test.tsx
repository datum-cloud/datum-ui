import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TimeRangePicker } from '../time-range-picker'

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

const baseProps = {
  value: {
    type: 'preset' as const,
    preset: '1h',
    from: '2024-01-15T04:00:00Z',
    to: '2024-01-15T05:00:00Z',
  },
  onChange: vi.fn(),
}

describe('timeRangePicker — responsive layout', () => {
  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    })
    window.matchMedia = originalMatchMedia
  })

  it('opens mobile sheet on mobile viewport', () => {
    setViewport(500)
    render(<TimeRangePicker {...baseProps} />)
    fireEvent.click(screen.getByRole('button'))
    // MobileSheet renders SheetTitle as role=heading with the sheet title
    expect(screen.getByRole('heading', { name: /select time range/i })).toBeInTheDocument()
  })

  it('does not render mobile sheet on desktop viewport', () => {
    setViewport(1440)
    render(<TimeRangePicker {...baseProps} />)
    // No sheet heading visible before opening (Popover used instead)
    expect(screen.queryByRole('heading', { name: /select time range/i })).not.toBeInTheDocument()
  })
})
