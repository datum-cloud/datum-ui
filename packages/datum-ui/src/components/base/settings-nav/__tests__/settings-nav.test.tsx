/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SettingsNav, SettingsNavItem, SettingsNavLabel } from '../settings-nav'

describe('settingsNav', () => {
  it('renders a labelled nav landmark', () => {
    render(
      <SettingsNav>
        <SettingsNavLabel>Settings</SettingsNavLabel>
        <SettingsNavItem href="#general">General</SettingsNavItem>
      </SettingsNav>,
    )
    expect(screen.getByRole('navigation', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByText('Settings')).toHaveAttribute('data-slot', 'settings-nav-label')
  })
})

describe('settingsNavItem', () => {
  it('marks the active item and exposes aria-current', () => {
    render(
      <SettingsNavItem href="#general" active>
        General
      </SettingsNavItem>,
    )
    const item = screen.getByRole('link', { name: 'General' })
    expect(item).toHaveAttribute('data-active', 'true')
    expect(item).toHaveAttribute('aria-current', 'page')
  })

  it('renders a danger variant', () => {
    render(
      <SettingsNavItem href="#danger" variant="danger">
        Danger Zone
      </SettingsNavItem>,
    )
    expect(screen.getByRole('link', { name: 'Danger Zone' })).toHaveAttribute(
      'data-variant',
      'danger',
    )
  })

  it('shows an error indicator and Soon badge', () => {
    render(
      <SettingsNavItem href="#tls" indicator badge="Soon">
        TLS
      </SettingsNavItem>,
    )
    expect(screen.getByLabelText('Needs attention')).toBeInTheDocument()
    expect(screen.getByText('Soon')).toHaveAttribute('data-slot', 'settings-nav-item-badge')
  })

  it('blocks navigation when disabled', () => {
    const onClick = vi.fn()
    render(
      <SettingsNavItem href="#caching" disabled onClick={onClick}>
        Caching
      </SettingsNavItem>,
    )
    const item = screen.getByText('Caching').closest('[data-slot="settings-nav-item"]')
    expect(item).toHaveAttribute('aria-disabled', 'true')
    expect(item).not.toHaveAttribute('href')
    item?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('slots onto a single child so a router Link can own the element', () => {
    render(
      <SettingsNavItem asChild icon={<span>ico</span>} indicator badge="Soon">
        <a href="/general">General</a>
      </SettingsNavItem>,
    )

    const link = screen.getByRole('link', { name: /General/ })
    expect(link).toHaveAttribute('href', '/general')
    expect(link).toHaveAttribute('data-slot', 'settings-nav-item')
    expect(link.querySelector('[data-slot="settings-nav-item-icon"]')).not.toBeNull()
    expect(link.querySelector('[data-slot="settings-nav-item-indicator"]')).not.toBeNull()
    expect(screen.getByText('Soon')).toHaveAttribute('data-slot', 'settings-nav-item-badge')
    expect(link.querySelectorAll('a')).toHaveLength(0)
  })

  it('colours the danger icon from data-variant, not a JS branch', () => {
    render(
      <SettingsNavItem href="#danger" variant="danger" icon={<span>ico</span>}>
        Danger Zone
      </SettingsNavItem>,
    )
    const item = screen.getByRole('link', { name: /Danger Zone/ })
    expect(item).toHaveAttribute('data-variant', 'danger')
    expect(item.querySelector('[data-slot="settings-nav-item-icon"]')).toHaveClass(
      'group-data-[variant=danger]/settings-nav-item:!text-destructive',
    )
  })
})
