import { resetViewport, setViewport } from '@test/viewport'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MobileSheet } from '../../mobile-sheet'
import { ResponsivePopover } from '../responsive-popover'

describe('responsivePopover', () => {
  afterEach(() => {
    resetViewport()
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

  it('is non-modal by default (does not lock body pointer events)', () => {
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
    expect(document.body.style.pointerEvents).not.toBe('none')
  })

  it('locks body pointer events when modal is set explicitly', () => {
    setViewport(1440)
    render(
      <ResponsivePopover
        open
        onOpenChange={() => {}}
        trigger={<button type="button">Trigger</button>}
        sheetTitle="Menu"
        modal
      >
        <div>Popover body</div>
      </ResponsivePopover>,
    )
    expect(screen.getByText('Popover body')).toBeInTheDocument()
    expect(document.body.style.pointerEvents).toBe('none')
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
