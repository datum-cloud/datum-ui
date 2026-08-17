import type { LucideIcon } from 'lucide-react'

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
