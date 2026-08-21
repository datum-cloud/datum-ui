import type { NavItem, NavItemBadge } from './types'
import { ChevronRight, ExternalLinkIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { memo } from 'react'
import { cn } from '../../../../utils/cn'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../base/collapsible'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarSeparator,
} from '../../../base/sidebar'
import { Icon } from '../../../icons/icon-wrapper'
import { hasActiveDescendant, isNavItemActive } from './active-path'
import { getNavItemKey, useNavMenuContext } from './nav-menu-context'
import { NavSidebarMenuButton } from './parts'

interface NavItemProps {
  item: NavItem
  level: number
}

const COLLAPSIBLE_CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.06 },
  },
} as const

const COLLAPSIBLE_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: -4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] as const },
  },
} as const

/** Stable React key for a rendered nav item at a given depth. */
function itemKeyOf(item: NavItem, level: number): string {
  return `${item.title}-${item.href || ''}-${level}`
}

/**
 * Cloudflare-style nav status chip: short inline pill with a dashed border,
 * sitting immediately after the title (never overlapping / corner-pinned).
 * Uses `div` (not `span`) so SidebarMenuButton's `[&>span:last-child]:truncate`
 * does not clip the chip.
 */
function NavBadge({ badge }: { badge: NavItemBadge }) {
  return (
    <div
      className={cn(
        'text-muted-foreground inline-flex shrink-0 items-center rounded-full border border-dashed px-1.5 py-px',
        'text-[10px] leading-none font-medium tracking-wide',
        'border-border/80',
      )}
    >
      {badge.label}
    </div>
  )
}

/**
 * Recursive nav row. Dispatches to the correct presentational part based on the
 * item type and the current sidebar state, and renders itself for children.
 * Memoized so unchanged subtrees skip re-rendering when their props are stable.
 *
 * Items with children use {@link NavCollapsibleItem}. Section headers use
 * {@link NavGroup} (always open, no dropdown).
 */
export const NavMenuItem = memo(({ item, level = 0 }: { item: NavItem, level?: number }) => {
  if (item.hidden) {
    return null
  }

  if (item.type === 'group') {
    return <NavGroup item={item} level={level} />
  }

  const hasChildren = (item.children || []).length > 0

  if (hasChildren) {
    return <NavCollapsibleItem item={item} level={level} />
  }

  return <NavLeafItem item={item} level={level} />
})

NavMenuItem.displayName = 'NavMenuItem'

/** A labelled group of nav items (always open — Vercel-style section headers). */
function NavGroup({ item, level }: NavItemProps) {
  const ctx = useNavMenuContext()
  const { pathname, isIconRail, isMobile } = ctx
  const hasActiveChild
    = (item.children?.some(child => hasActiveDescendant(child, pathname)) ?? false)
  const sidebarCollapsed = isIconRail && !isMobile

  // Icon rail: one button per section (avoids flooding the rail with every leaf).
  if (sidebarCollapsed) {
    return (
      <>
        {item.showSeparatorAbove && <SidebarSeparator className="my-1" />}
        <SidebarMenu className="px-2">
          <NavSidebarMenuButton
            item={item}
            isActive={hasActiveChild}
            disableTooltip={ctx.disableTooltip}
            className={cn(
              ctx.itemClassName,
              hasActiveChild && '[&>svg:first-of-type]:text-primary',
            )}
            activeClassName={ctx.activeItemClassName}
            onClick={() => ctx.setOpen(true)}
          />
        </SidebarMenu>
        {item.showSeparatorBelow && <SidebarSeparator className="my-2" />}
      </>
    )
  }

  return (
    <>
      {item.showSeparatorAbove && <SidebarSeparator className="my-2" />}
      <SidebarGroup className="mb-1 p-0! px-2">
        {item.title && (
          <SidebarMenu className="w-full">
            <NavSidebarMenuButton
              item={item}
              isActive={hasActiveChild}
              disableTooltip
              className={cn(
                ctx.itemClassName,
                hasActiveChild && '[&>svg:first-of-type]:text-primary',
                'pointer-events-none h-7 text-xs font-medium text-muted-foreground hover:bg-transparent',
                hasActiveChild && 'text-primary',
              )}
              activeClassName={ctx.activeItemClassName}
            >
              <span className="min-w-0 truncate">{item.title}</span>
            </NavSidebarMenuButton>
          </SidebarMenu>
        )}
        <SidebarGroupContent className="flex flex-col gap-0.5">
          {(item.children || []).map(child => (
            <NavMenuItem key={itemKeyOf(child, level + 1)} item={child} level={level + 1} />
          ))}
        </SidebarGroupContent>
      </SidebarGroup>
      {item.showSeparatorBelow && <SidebarSeparator className="my-2" />}
    </>
  )
}

/**
 * Collapsible section for items with children. Used in both expanded and
 * icon-collapsed sidebar modes so width animation does not remount the tree.
 * When the sidebar is icon-collapsed, the panel is forced closed; clicking the
 * parent expands the sidebar and opens this section.
 */
function NavCollapsibleItem({ item, level }: NavItemProps) {
  const ctx = useNavMenuContext()
  const {
    pathname,
    state,
    isIconRail,
    isMobile,
    openItems,
    isInitialMount,
    previousOpenItems,
    previousState,
    previousPathname,
  } = ctx
  const stateKey = getNavItemKey(item, level)
  const isActive = isNavItemActive(item, pathname)
  const hasActiveChild
    = (item.children?.filter(child => hasActiveDescendant(child, pathname)) || []).length > 0
  const sidebarCollapsed = isIconRail && !isMobile
  const isOpen = openItems[stateKey] !== undefined ? openItems[stateKey] : hasActiveChild
  // Keep closed while icon-collapsed so nested rows don't reserve height mid-transition.
  const panelOpen = sidebarCollapsed ? false : isOpen

  return (
    <>
      {item.showSeparatorAbove && <SidebarSeparator className="my-2" />}
      <SidebarMenu className="px-2">
        <Collapsible
          key={`collapsed-item-drop-down-item-${item.title}-${level}`}
          asChild
          open={panelOpen}
          onOpenChange={(open) => {
            if (sidebarCollapsed) {
              // Icon rail click: expand the sidebar and open this section.
              ctx.setOpen(true)
              ctx.setOpenItems(prev => ({ ...prev, [stateKey]: true }))
              return
            }
            ctx.setOpenItems(prev => ({ ...prev, [stateKey]: open }))
          }}
          className="group/collapsible"
        >
          <SidebarMenuItem className="[&>*:first-child]:w-full">
            <CollapsibleTrigger asChild className="w-full">
              <NavSidebarMenuButton
                item={item}
                isActive={isActive || (sidebarCollapsed && hasActiveChild)}
                disableTooltip={ctx.disableTooltip}
                className={cn(
                  ctx.itemClassName,
                  // Emphasize label + leading icon when a nested route is active.
                  hasActiveChild && 'font-semibold [&>svg:first-of-type]:text-primary',
                )}
                activeClassName={ctx.activeItemClassName}
              >
                <span className="min-w-0 truncate group-data-[collapsible=icon]:hidden">
                  {item.title}
                </span>
                {item.badge && (
                  <span className="group-data-[collapsible=icon]:hidden">
                    <NavBadge badge={item.badge} />
                  </span>
                )}
                <Icon
                  icon={ChevronRight}
                  className="ml-auto shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:rotate-90"
                />
              </NavSidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden group-data-[collapsible=icon]:hidden">
              <div style={{ minHeight: 0, overflow: 'hidden' }}>
                <motion.div
                  key={`collapsible-${stateKey}-${panelOpen}`}
                  variants={COLLAPSIBLE_CONTAINER_VARIANTS}
                  initial={
                    isInitialMount.current
                    || (previousOpenItems.current[stateKey]
                      === openItems[stateKey]
                      && previousState.current === state
                      && previousPathname.current === pathname
                      && !hasActiveChild)
                      ? 'visible'
                      : 'hidden'
                  }
                  animate={panelOpen ? 'visible' : 'hidden'}
                >
                  <SidebarMenuSub
                    className={cn(
                      level >= 1 ? 'mr-0 pr-[.1rem]' : '',
                      level === 2 ? 'pl-4' : '',
                      level === 3 ? 'pl-6' : '',
                      'mr-0 gap-0.5 pr-0',
                    )}
                  >
                    {item.children?.map((subItem, index) => (
                      <motion.div
                        key={`${subItem.href}-${level}-${index}`}
                        variants={COLLAPSIBLE_CHILD_VARIANTS}
                      >
                        <NavMenuItem item={subItem} level={level + 1} />
                      </motion.div>
                    ))}
                  </SidebarMenuSub>
                </motion.div>
              </div>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
      {item.showSeparatorBelow && <SidebarSeparator className="my-2" />}
    </>
  )
}

/** A leaf nav item: an internal router link or an external link. */
function NavLeafItem({ item, level }: NavItemProps) {
  const ctx = useNavMenuContext()
  const { pathname, getLinkProps, handleNavigation } = ctx
  const isActive = isNavItemActive(item, pathname)
  const hasActiveChild
    = (item.children?.filter(child => hasActiveDescendant(child, pathname)) || []).length > 0
  return (
    <>
      {item.showSeparatorAbove && <SidebarSeparator className="my-2" />}
      <SidebarMenu className={cn(`level_${level} px-2`)}>
        <SidebarMenuItem className="[&>*:first-child]:w-full">
          <NavSidebarMenuButton
            asChild
            item={item}
            isActive={isActive && !hasActiveChild}
            disableTooltip={ctx.disableTooltip}
            className={cn(
              level >= 1 && 'h-7',
              // Soften icon only — keep the label readable; badge carries "planned" signal.
              item.muted && '[&_svg]:text-muted-foreground',
              ctx.itemClassName,
            )}
            activeClassName={ctx.activeItemClassName}
          >
            {item.type === 'externalLink'
              ? (
                  <a
                    href={item.href || ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-0 items-center gap-2"
                  >
                    {item?.icon && (
                      <Icon icon={item.icon} className="size-4 shrink-0 transition-all duration-300" />
                    )}
                    <span className="min-w-0 truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                    {item.badge
                      ? (
                          <span className="group-data-[collapsible=icon]:hidden">
                            <NavBadge badge={item.badge} />
                          </span>
                        )
                      : (
                          <Icon
                            icon={ExternalLinkIcon}
                            className="ml-auto size-4 shrink-0 group-data-[collapsible=icon]:hidden"
                          />
                        )}
                  </a>
                )
              : (
                  <ctx.linkComponent
                    {...getLinkProps(item.href || '')}
                    onClick={handleNavigation}
                    onMouseEnter={() => item.onPrefetch?.()}
                    className="flex min-w-0 items-center gap-2"
                  >
                    {item?.icon && (
                      <Icon
                        icon={item.icon}
                        className="text-sidebar-primary shrink-0 transition-all duration-300"
                      />
                    )}
                    <span className="min-w-0 truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                    {item.badge && (
                      <span className="group-data-[collapsible=icon]:hidden">
                        <NavBadge badge={item.badge} />
                      </span>
                    )}
                  </ctx.linkComponent>
                )}
          </NavSidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      {item.showSeparatorBelow && <SidebarSeparator className="my-2" />}
    </>
  )
}

export { itemKeyOf }
