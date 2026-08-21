import type { LucideIcon } from 'lucide-react'
import type { BadgeProps } from '../../../base/badge'

/**
 * Declarative status chip rendered inline after a nav item title
 * (Cloudflare-style dashed pill: "Beta", "New", "Soon").
 * Data-only so hosts/plugins never pass React nodes into the sidebar.
 *
 * `type` / `theme` are retained for API compatibility but unused — nav chips
 * always use the shared dashed-pill treatment.
 */
export interface NavItemBadge {
  label: string
  type?: BadgeProps['type']
  theme?: BadgeProps['theme']
}

export interface NavItem {
  title: string
  href: string | null
  type: 'link' | 'group' | 'collapsible' | 'externalLink'
  disabled?: boolean
  count?: number
  icon?: LucideIcon
  children?: NavItem[]
  open?: boolean
  hidden?: boolean
  showSeparatorAbove?: boolean
  showSeparatorBelow?: boolean
  /** Optional status badge (e.g. "Coming soon", "Beta"). */
  badge?: NavItemBadge
  /** Soften label/icon color (e.g. planned services) without disabling the link. */
  muted?: boolean

  // Exclude specific sub-paths from activating this nav item
  // Use this for sibling routes like `/export-policies` and `/export-policies/new`
  // where `/export-policies` should NOT be active when on `/export-policies/new`
  // but SHOULD be active for detail routes like `/export-policies/:id/overview`
  excludePaths?: string[]

  // Tab Child Links - used to highlight parent nav item when on child tab routes
  // TODO: Replace with proper route hierarchy detection or nested route structure
  // Currently needed to mark parent nav items as active when user is on tab child routes
  // Mixed layout scenario: `/account/preferences` and `/account/activity` use tabs layout,
  // while `/account/organizations` uses sidebar layout, but all share the same parent sidebar nav
  tabChildLinks?: string[]

  /** Called when the user hovers over the link (e.g. to prefetch route data). */
  onPrefetch?: () => void
}
