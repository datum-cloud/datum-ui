import type { NavItem } from './types'

/**
 * Pure active-path predicates for the nav menu.
 *
 * These were previously trapped as closures inside the `NavMenu` render
 * function. Extracted here as plain functions of `(item, currentPath)` so the
 * routing logic can be unit-tested without rendering React.
 */

/**
 * Normalise a pathname for comparison: ensure a leading slash and strip a
 * trailing slash (except for the root path itself).
 */
export function normalizePath(p: string): string {
  let result = p.startsWith('/') ? p : `/${p}`
  // Remove trailing slash, unless it's the root path itself
  if (result !== '/' && result.endsWith('/')) {
    result = result.slice(0, -1)
  }
  return result
}

/**
 * Whether `item` itself should be rendered as the active nav entry for the
 * given `currentPath`.
 *
 * Rules:
 * - An item with no href is never directly active.
 * - The root item (`/`) is active only on the exact root path.
 * - A parent with children is active only on an exact match AND only when none
 *   of its descendants match (the deepest match wins).
 * - A leaf is active on exact match or a non-excluded sub-path, or when the
 *   path matches one of its `tabChildLinks`.
 */
export function isNavItemActive(item: NavItem, currentPath: string): boolean {
  const cleanCurrentPath = normalizePath(currentPath)

  // If no href, can't be active
  if (!item.href) {
    return false
  }

  const cleanNavPath = normalizePath(item.href)

  // Handle root path case: nav item is '/'
  if (cleanNavPath === '/') {
    return cleanCurrentPath === '/' // Active if current path is also root
  }

  // Recursively check if any descendant href matches the current path. Uses
  // proper path-segment matching (startsWith `${path}/`) so '/dns-zones/123'
  // does not falsely match a '/dns' child.
  const anyDescendantMatches = (navItem: NavItem): boolean => {
    if (!navItem.children || navItem.children.length === 0) {
      return false
    }

    return navItem.children.some((child) => {
      if (!child.href) {
        // If child has no href but has children, check its descendants
        return anyDescendantMatches(child)
      }

      const cleanChildPath = normalizePath(child.href)
      const childMatches
        = cleanCurrentPath === cleanChildPath
          || cleanCurrentPath.startsWith(`${cleanChildPath}/`)

      if (childMatches) {
        return true
      }

      return anyDescendantMatches(child)
    })
  }

  // If item has children, check if any descendant is active
  const hasChildren = (item.children || []).length > 0
  if (hasChildren) {
    // If a descendant is active, parent should not be active
    if (anyDescendantMatches(item)) {
      return false
    }

    // If no descendant is active, only exact match for parent
    return cleanCurrentPath === cleanNavPath
  }

  // For items without children, check for exact match or sub-path.
  // Check if current path is in the excluded paths list.
  const isExcluded
    = item.excludePaths?.some((excludePath) => {
      const cleanExcludePath = normalizePath(excludePath)
      return (
        cleanCurrentPath === cleanExcludePath
        || cleanCurrentPath.startsWith(`${cleanExcludePath}/`)
      )
    }) ?? false

  // Match exact path, or sub-paths that are not excluded
  const isDirectMatch
    = cleanCurrentPath === cleanNavPath
      || (!isExcluded && cleanCurrentPath.startsWith(`${cleanNavPath}/`))

  // Check tabChildLinks for mixed layout scenarios (tabs + sidebar)
  const isTabChildMatch
    = item.tabChildLinks?.some((childPath) => {
      const cleanChildPath = normalizePath(childPath)
      return (
        cleanCurrentPath === cleanChildPath
        || cleanCurrentPath.startsWith(`${cleanChildPath}/`)
      )
    }) ?? false

  return isDirectMatch || isTabChildMatch
}

/**
 * Whether `item` or any of its descendants is active for `currentPath`. Used to
 * decide which collapsible groups should be expanded / kept open.
 */
export function hasActiveDescendant(item: NavItem, currentPath: string): boolean {
  if (isNavItemActive(item, currentPath)) {
    return true
  }
  if (item.children) {
    return item.children.some(child => hasActiveDescendant(child, currentPath))
  }
  return false
}

/** Depth-first search for the first item whose href matches `href` exactly. */
export function findItemByHref(items: NavItem[], href: string): NavItem | null {
  for (const item of items) {
    if (item.href === href) {
      return item
    }
    if (item.children) {
      const found = findItemByHref(item.children, href)
      if (found) {
        return found
      }
    }
  }
  return null
}
