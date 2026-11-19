/// <reference types="@testing-library/jest-dom/vitest" />
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SidebarInput, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from '../index'

const viewport = { mobile: false }
vi.mock('@repo/shadcn/hooks/use-mobile', () => ({ useIsMobile: () => viewport.mobile }))

/** Shows the sidebar state the provider exposes. */
function Probe() {
  const { state, openMobile } = useSidebar()
  return <output data-testid="probe" data-state={state} data-open-mobile={String(openMobile)} />
}

function renderSidebar(props: Partial<React.ComponentProps<typeof SidebarProvider>> = {}) {
  return render(
    <SidebarProvider {...props}>
      <SidebarTrigger />
      <SidebarInput placeholder="Filter" />
      <Probe />
    </SidebarProvider>,
  )
}

const state = () => screen.getByTestId('probe').getAttribute('data-state')

beforeEach(() => {
  viewport.mobile = false
  // Below the lg breakpoint the provider starts collapsed; test at desktop width.
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 })
  document.cookie = 'sidebar_state=; max-age=0; path=/'
})

afterEach(() => vi.restoreAllMocks())

describe('sidebarProvider', () => {
  it('toggles between expanded and collapsed with the trigger', async () => {
    renderSidebar()
    expect(state()).toBe('expanded')
    await userEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }))
    expect(state()).toBe('collapsed')
    await userEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }))
    expect(state()).toBe('expanded')
  })

  it('starts collapsed with defaultOpen false', () => {
    renderSidebar({ defaultOpen: false })
    expect(state()).toBe('collapsed')
  })

  it('reports changes through onOpenChange when controlled', async () => {
    const onOpenChange = vi.fn()
    renderSidebar({ open: true, onOpenChange })
    await userEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(state()).toBe('expanded')
  })

  it('toggles with Cmd+B and Ctrl+B', () => {
    renderSidebar()
    fireEvent.keyDown(window, { key: 'b', metaKey: true })
    expect(state()).toBe('collapsed')
    fireEvent.keyDown(window, { key: 'b', ctrlKey: true })
    expect(state()).toBe('expanded')
  })

  it('ignores a bare b, including one typed in the sidebar input', async () => {
    renderSidebar()
    fireEvent.keyDown(window, { key: 'b' })
    await userEvent.type(screen.getByPlaceholderText('Filter'), 'b')
    expect(state()).toBe('expanded')
  })

  it('remembers the state in a cookie', async () => {
    renderSidebar()
    await userEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }))
    expect(document.cookie).toContain('sidebar_state=false')
  })

  it('opens the mobile sheet instead of collapsing on a phone', async () => {
    viewport.mobile = true
    renderSidebar()
    await userEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }))
    expect(screen.getByTestId('probe')).toHaveAttribute('data-open-mobile', 'true')
  })
})

describe('sidebarMenuButton', () => {
  it('marks the active item and does not run a disabled one', async () => {
    const onClick = vi.fn()
    render(
      <SidebarProvider>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive>Projects</SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton disabled onClick={onClick}>Billing</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarProvider>,
    )
    expect(screen.getByRole('button', { name: 'Projects' })).toHaveAttribute('data-active', 'true')
    await userEvent.click(screen.getByRole('button', { name: 'Billing' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
