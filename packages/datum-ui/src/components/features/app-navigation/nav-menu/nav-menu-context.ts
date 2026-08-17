import type {
  Dispatch,
  ElementType,
  RefObject,
  SetStateAction,
} from 'react'
import { createContext, use } from 'react'

/**
 * Shared render state for the nav menu tree.
 *
 * `NavMenu` owns all state, refs and handlers and publishes them through this
 * context so the recursive `NavMenuItem` (and its part components) can render
 * themselves for children without prop-drilling ~15 values through every level.
 */
export interface NavMenuContextValue {
  /** Current URL pathname. */
  pathname: string
  /** Resolved sidebar state (override wins over the sidebar provider). */
  state: 'expanded' | 'collapsed'
  isMobile: boolean
  openItems: Record<string, boolean>
  setOpenItems: Dispatch<SetStateAction<Record<string, boolean>>>
  setOpen: (open: boolean) => void
  disableTooltip?: boolean
  /** Class applied to every nav item button. */
  itemClassName?: string
  /** Class applied only to the active nav item button. */
  activeItemClassName?: string
  /** Link component used to render navigation links. */
  linkComponent: ElementType
  /** Build props for the configured link component (`href` vs `to`+`href`). */
  getLinkProps: (href: string) => { href: string, to?: string }
  handleNavigation: () => void
  isInitialMount: RefObject<boolean>
  previousOpenItems: RefObject<Record<string, boolean>>
  previousState: RefObject<'expanded' | 'collapsed'>
  previousPathname: RefObject<string>
}

const NavMenuContext = createContext<NavMenuContextValue | null>(null)

export const NavMenuProvider = NavMenuContext.Provider

export function useNavMenuContext(): NavMenuContextValue {
  const ctx = use(NavMenuContext)
  if (!ctx) {
    throw new Error('NavMenuItem must be rendered within a NavMenu')
  }
  return ctx
}

/**
 * Stable identity key for a nav item's open/closed state.
 * Uses type + title + href + level (not href alone) so that collapsible groups
 * with href:null can still be toggled and duplicate hrefs never collide.
 */
export function getNavItemKey(item: { type: string, title: string, href: string | null }, level: number): string {
  return `${item.type}:${item.title}:${item.href ?? ''}:${level}`
}
