import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { InSheetContext } from '../../../../base/mobile-sheet'
import { AbsoluteRangePanel } from '../absolute-range-panel'

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
  fromUtc: '2024-01-15T04:00:00Z',
  toUtc: '2024-01-15T05:00:00Z',
  timezone: 'UTC',
  onRangeChange: vi.fn(),
}

describe('absoluteRangePanel — context suppression', () => {
  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    })
    window.matchMedia = originalMatchMedia
  })

  it('stays as popover (no sheet heading) when InSheetContext is true on mobile viewport', () => {
    setViewport(500)
    render(
      <InSheetContext value={true}>
        <AbsoluteRangePanel {...baseProps} />
      </InSheetContext>,
    )
    // Calendar pickers use ResponsivePopover — when inSheet=true they must NOT open a MobileSheet,
    // so no sheet heading should be present in the document.
    expect(
      screen.queryByRole('heading', { name: /select start date|select end date/i }),
    ).not.toBeInTheDocument()
  })

  it('renders date trigger buttons regardless of sheet context', () => {
    setViewport(500)
    render(
      <InSheetContext value={true}>
        <AbsoluteRangePanel {...baseProps} />
      </InSheetContext>,
    )
    // Both date trigger buttons should be visible
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })
})
