import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MobileSheet } from '../../mobile-sheet'
import { ResponsivePopover } from '../responsive-popover'

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

describe('responsivePopover', () => {
  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    })
    window.matchMedia = originalMatchMedia
  })

  it('renders popover content on desktop viewport', () => {
    setViewport(1440)
    render(
      <ResponsivePopover
        open
        onOpenChange={() => {}}
        trigger={<button type="button">Trigger</button>}
        sheetTitle="Menu"
      >
        <div>Popover body</div>
      </ResponsivePopover>,
    )
    expect(screen.getByText('Popover body')).toBeInTheDocument()
  })

  it('renders mobile sheet on mobile viewport', () => {
    setViewport(500)
    render(
      <ResponsivePopover
        open
        onOpenChange={() => {}}
        trigger={<button type="button">Trigger</button>}
        sheetTitle="Mobile Menu"
      >
        <div>Sheet body</div>
      </ResponsivePopover>,
    )
    expect(screen.getByRole('heading', { name: 'Mobile Menu' })).toBeInTheDocument()
    expect(screen.getByText('Sheet body')).toBeInTheDocument()
  })

  it('stays as popover on mobile when responsive={false}', () => {
    setViewport(500)
    render(
      <ResponsivePopover
        open
        onOpenChange={() => {}}
        trigger={<button type="button">Trigger</button>}
        sheetTitle="Menu"
        responsive={false}
      >
        <div>Popover body</div>
      </ResponsivePopover>,
    )
    expect(screen.getByText('Popover body')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Menu' })).not.toBeInTheDocument()
  })

  it('stays as popover on mobile when inside a MobileSheet', () => {
    setViewport(500)
    render(
      <MobileSheet open onOpenChange={() => {}} title="Outer">
        <ResponsivePopover
          open
          onOpenChange={() => {}}
          trigger={<button type="button">Trigger</button>}
          sheetTitle="Inner"
        >
          <div>Inner body</div>
        </ResponsivePopover>
      </MobileSheet>,
    )
    expect(screen.getByText('Inner body')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Inner' })).not.toBeInTheDocument()
  })
})
