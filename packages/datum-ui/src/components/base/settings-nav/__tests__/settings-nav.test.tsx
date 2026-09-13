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
})
