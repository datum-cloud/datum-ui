import type {
  ComponentProps,
  ElementType,
} from 'react'
import type { NavMenuContextValue } from './nav-menu-context'
import type { NavItem } from './types'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '../../../../utils/cn'
import { useSidebar } from '../../../base/sidebar'
import { hasActiveDescendant } from './active-path'
import { getNavItemKey, NavMenuProvider } from './nav-menu-context'
import { itemKeyOf, NavMenuItem } from './nav-menu-item'

export type { NavItem } from './types'

export function NavMenu({ ref, className, items, currentPath, linkComponent: LinkComp = 'a', overrideState, itemClassName, activeItemClassName, disableTooltip, closeOnNavigation, ...props }: ComponentProps<'ul'> & {
  items: NavItem[]
  /** Current URL pathname — replaces internal useLocation() */
  currentPath: string
  /**
   * Link component to render navigation links (defaults to native `<a>`).
   * Custom components receive both `to` and `href` (set to the same destination)
   * so router links (`to`, e.g. React Router) and href-based links (e.g. Next.js) both work.
   */
  linkComponent?: ElementType
  overrideState?: 'expanded' | 'collapsed'
  /** Class applied to every nav item button. */
  itemClassName?: string
  /** Class applied only to the active nav item button. Use to bold the label, change colour, etc. */
  activeItemClassName?: string
  disableTooltip?: boolean
  closeOnNavigation?: boolean
} & { ref?: React.RefObject<HTMLUListElement | null> }) {
  const pathname = currentPath
  const { state: sidebarState, isMobile, closeForNavigation, setOpen } = useSidebar()
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const isInitialMount = useRef(true)
  const previousOpenItems = useRef<Record<string, boolean>>({})
  const previousPathname = useRef(pathname)

  // Use overrideState if provided, otherwise use sidebar state
  const state = overrideState ?? sidebarState
  const previousState = useRef(state)

  // Track previous open state to detect transitions
  useEffect(() => {
    previousOpenItems.current = openItems
    // Mark initial mount as complete after first render
    if (isInitialMount.current) {
      isInitialMount.current = false
    }
  }, [openItems])

  // Track pathname changes
  useEffect(() => {
    previousPathname.current = pathname
  }, [pathname])

  // Close collapsibles when sidebar collapses (unless they have active children)
  useEffect(() => {
    if (previousState.current === 'expanded' && state === 'collapsed') {
      setOpenItems((prev) => {
        const newOpenItems: Record<string, boolean> = {}
        // Walk the tree with the same key scheme used for rendering and keep only
        // items whose subtree contains an active route open.
        const keepActive = (navItems: NavItem[], level: number) => {
          navItems.forEach((navItem) => {
            const key = getNavItemKey(navItem, level)
            if (prev[key] && hasActiveDescendant(navItem, pathname)) {
              newOpenItems[key] = true
            }
            if (navItem.children) {
              keepActive(navItem.children, level + 1)
            }
          })
        }
        keepActive(items, 0)
        return newOpenItems
      })
    }
    previousState.current = state
  }, [state, items, pathname])

  // Build link props for the configured link component. Native anchors get `href`;
  // custom components get both `to` and `href` so router- and href-based links both work.
  const getLinkProps = useCallback(
    (href: string) => (LinkComp === 'a' ? { href } : { to: href, href }),
    [LinkComp],
  )

  // Handler to close sidebar on navigation (only on desktop when closeOnNavigation prop is enabled)
  // Uses closeForNavigation method which clears hover state and temporarily locks hover expansion
  const handleNavigation = useCallback(() => {
    if (closeOnNavigation && !isMobile) {
      closeForNavigation()
    }
  }, [closeOnNavigation, isMobile, closeForNavigation])

  const contextValue = useMemo<NavMenuContextValue>(
    () => ({
      pathname,
      state,
      isMobile,
      openItems,
      setOpenItems,
      setOpen,
      disableTooltip,
      itemClassName,
      activeItemClassName,
      linkComponent: LinkComp,
      getLinkProps,
      handleNavigation,
      isInitialMount,
      previousOpenItems,
      previousState,
      previousPathname,
    }),
    [
      pathname,
      state,
      isMobile,
      openItems,
      setOpen,
      disableTooltip,
      itemClassName,
      activeItemClassName,
      LinkComp,
      getLinkProps,
      handleNavigation,
    ],
  )

  return (
    <NavMenuProvider value={contextValue}>
      <ul
        ref={ref}
        data-sidebar="menu"
        className={cn('flex h-full w-full min-w-0 flex-col gap-0.5 py-2', className)}
        {...props}
      >
        {(items || []).map(item => (
          <NavMenuItem key={itemKeyOf(item, 0)} item={item} level={0} />
        ))}
      </ul>
    </NavMenuProvider>
  )
}

NavMenu.displayName = 'NavMenu'
