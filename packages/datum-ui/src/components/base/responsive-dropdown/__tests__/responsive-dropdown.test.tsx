import { resetViewport, setViewport } from '@test/viewport'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MobileSheet } from '../../mobile-sheet'
import { ResponsiveDropdown } from '../responsive-dropdown'

describe('responsiveDropdown', () => {
  afterEach(() => {
    resetViewport()
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

  it('fires the trigger\'s own onClick exactly once on mobile (no double-fire)', () => {
    setViewport(500)
    const triggerClick = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <ResponsiveDropdown
        open={false}
        onOpenChange={onOpenChange}
        trigger={(
          <button type="button" onClick={triggerClick}>
            Trigger
          </button>
        )}
        sheetTitle="Menu"
      >
        <div>Sheet body</div>
      </ResponsiveDropdown>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Trigger' }))
    expect(triggerClick).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(true)
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
