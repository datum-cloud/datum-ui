import type { NavItem } from '../types'
import { describe, expect, it } from 'vitest'
import {
  findItemByHref,
  hasActiveDescendant,
  isNavItemActive,
  normalizePath,
} from '../active-path'

function link(title: string, href: string | null, extra: Partial<NavItem> = {}): NavItem {
  return { title, href, type: 'link', ...extra }
}

describe('normalizePath', () => {
  it('adds a leading slash when missing', () => {
    expect(normalizePath('dns')).toBe('/dns')
  })

  it('strips a trailing slash except at the root', () => {
    expect(normalizePath('/dns/')).toBe('/dns')
    expect(normalizePath('/')).toBe('/')
  })
})

describe('isNavItemActive', () => {
  it('returns false when the item has no href', () => {
    expect(isNavItemActive(link('Group', null), '/anything')).toBe(false)
  })

  it('activates the root item only on the root path', () => {
    expect(isNavItemActive(link('Home', '/'), '/')).toBe(true)
    expect(isNavItemActive(link('Home', '/'), '/dns')).toBe(false)
  })

  it('matches exact paths and sub-paths for leaves', () => {
    expect(isNavItemActive(link('DNS', '/dns'), '/dns')).toBe(true)
    expect(isNavItemActive(link('DNS', '/dns'), '/dns/zones/1')).toBe(true)
  })

  it('does not treat a path prefix as a sub-path match', () => {
    // '/dns-zones' must not activate the '/dns' item
    expect(isNavItemActive(link('DNS', '/dns'), '/dns-zones')).toBe(false)
  })

  it('honours excludePaths for sibling routes', () => {
    const item = link('Policies', '/export-policies', { excludePaths: ['/export-policies/new'] })
    expect(isNavItemActive(item, '/export-policies/new')).toBe(false)
    expect(isNavItemActive(item, '/export-policies/123/overview')).toBe(true)
  })

  it('activates via tabChildLinks for mixed tab/sidebar layouts', () => {
    const item = link('Account', '/account/organizations', { tabChildLinks: ['/account/preferences'] })
    expect(isNavItemActive(item, '/account/preferences')).toBe(true)
  })

  it('does not activate a parent when a descendant matches', () => {
    const parent = link('Settings', '/settings', {
      children: [link('Members', '/settings/members')],
    })
    expect(isNavItemActive(parent, '/settings/members')).toBe(false)
    // exact parent match is still active when no descendant matches
    expect(isNavItemActive(parent, '/settings')).toBe(true)
  })
})

describe('hasActiveDescendant', () => {
  const tree = link('Settings', '/settings', {
    children: [
      link('Members', '/settings/members'),
      link('Billing', '/settings/billing'),
    ],
  })

  it('is true when a descendant is active', () => {
    expect(hasActiveDescendant(tree, '/settings/billing/invoices')).toBe(true)
  })

  it('is true when the item itself is active', () => {
    const leaf = link('DNS', '/dns')
    expect(hasActiveDescendant(leaf, '/dns/zones')).toBe(true)
  })

  it('is false when nothing in the subtree matches', () => {
    expect(hasActiveDescendant(tree, '/secrets')).toBe(false)
  })
})

describe('findItemByHref', () => {
  const items: NavItem[] = [
    link('Home', '/'),
    link('Settings', '/settings', {
      children: [link('Members', '/settings/members')],
    }),
  ]

  it('finds a nested item by exact href', () => {
    expect(findItemByHref(items, '/settings/members')?.title).toBe('Members')
  })

  it('returns null when no item matches', () => {
    expect(findItemByHref(items, '/missing')).toBeNull()
  })
})
