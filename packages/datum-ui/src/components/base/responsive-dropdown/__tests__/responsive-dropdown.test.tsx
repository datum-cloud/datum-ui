import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MobileSheet } from '../../mobile-sheet'
import { ResponsiveDropdown } from '../responsive-dropdown'

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

describe('responsiveDropdown', () => {
  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    })
    window.matchMedia = originalMatchMedia
  })

  it('renders dropdown content on desktop viewport', () => {
    setViewport(1440)
    render(
      <ResponsiveDropdown
        open
        onOpenChange={() => {}}
        trigger={<button type="button">Trigger</button>}
        sheetTitle="Menu"
      >
        <div>Dropdown body</div>
      </ResponsiveDropdown>,
    )
    expect(screen.getByText('Dropdown body')).toBeInTheDocument()
  })

  it('stays open when the window loses focus (e.g. native file picker opens)', () => {
    setViewport(1440)
    const onOpenChange = vi.fn()
    render(
      <ResponsiveDropdown
        open
        onOpenChange={onOpenChange}
        trigger={<button type="button">Trigger</button>}
        sheetTitle="Menu"
      >
        <div>Dropdown body</div>
      </ResponsiveDropdown>,
    )
    fireEvent.blur(window)
    expect(onOpenChange).not.toHaveBeenCalledWith(false)
  })

  it('renders mobile sheet on mobile viewport', () => {
    setViewport(500)
    render(
      <ResponsiveDropdown
        open
        onOpenChange={() => {}}
        trigger={<button type="button">Trigger</button>}
        sheetTitle="Mobile Menu"
      >
        <div>Sheet body</div>
      </ResponsiveDropdown>,
    )
    expect(screen.getByRole('heading', { name: 'Mobile Menu' })).toBeInTheDocument()
    expect(screen.getByText('Sheet body')).toBeInTheDocument()
  })

  it('stays as dropdown on mobile when responsive={false}', () => {
    setViewport(500)
    render(
      <ResponsiveDropdown
        open
        onOpenChange={() => {}}
        trigger={<button type="button">Trigger</button>}
        sheetTitle="Menu"
        responsive={false}
      >
        <div>Dropdown body</div>
      </ResponsiveDropdown>,
    )
    expect(screen.getByText('Dropdown body')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Menu' })).not.toBeInTheDocument()
  })

  it('stays as dropdown on mobile when inside a MobileSheet', () => {
    setViewport(500)
    render(
      <MobileSheet open onOpenChange={() => {}} title="Outer">
        <ResponsiveDropdown
          open
          onOpenChange={() => {}}
          trigger={<button type="button">Trigger</button>}
          sheetTitle="Inner"
        >
          <div>Inner body</div>
        </ResponsiveDropdown>
      </MobileSheet>,
    )
    expect(screen.getByText('Inner body')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Inner' })).not.toBeInTheDocument()
  })
})
