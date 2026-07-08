import type { NavItem } from './types'
import { ChevronRight, ExternalLinkIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { memo } from 'react'
import { cn } from '../../../../utils/cn'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../base/collapsible'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
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

/** Stable React key for a rendered nav item at a given depth. */
function itemKeyOf(item: NavItem, level: number): string {
  return `${item.title}-${item.href || ''}-${level}`
}

/**
 * Recursive nav row. Dispatches to the correct presentational part based on the
 * item type and the current sidebar state, and renders itself for children.
 * Memoized so unchanged subtrees skip re-rendering when their props are stable.
 */
export const NavMenuItem = memo(({ item, level = 0 }: { item: NavItem, level?: number }) => {
  const { state, isMobile } = useNavMenuContext()

  if (item.hidden) {
    return null
  }

  if (item.type === 'group') {
    return <NavGroup item={item} level={level} />
  }

  const hasChildren = (item.children || []).length > 0

  // Collapsed sidebar: items with children expand the sidebar and show dots.
  if (state === 'collapsed' && !isMobile && level <= 2 && hasChildren) {
    return <NavCollapsedItem item={item} level={level} />
  }

  // Expanded sidebar: items with children render as collapsible sections.
  if (hasChildren) {
    return <NavCollapsibleItem item={item} level={level} />
  }

  return <NavLeafItem item={item} level={level} />
})

NavMenuItem.displayName = 'NavMenuItem'

/** A labelled group of nav items (recurses into `NavMenuItem` for children). */
function NavGroup({ item, level }: NavItemProps) {
  return (
    <>
      <SidebarGroup className="mb-2 p-0! px-2">
        {item.title && (
          <SidebarGroupLabel className="lowercase group-data-[state=collapsed]:hidden first-letter:uppercase">
            {item.title}
          </SidebarGroupLabel>
        )}
        <SidebarGroupContent className="flex flex-col gap-1">
          {(item.children || []).map(child => (
            <NavMenuItem key={itemKeyOf(child, level + 1)} item={child} level={level + 1} />
          ))}
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarSeparator className="my-2 hidden group-data-[state=collapsed]:block" />
    </>
  )
}

/**
 * Collapsed-sidebar rendering for an item with children: the parent button
 * expands the sidebar, and active descendants are represented as dots.
 */
function NavCollapsedItem({ item, level }: NavItemProps) {
  const ctx = useNavMenuContext()
  const { pathname, getLinkProps, handleNavigation } = ctx
  const stateKey = getNavItemKey(item, level)
  const isActive = isNavItemActive(item, pathname)
  const hasActiveChild
    = (item.children?.filter(child => hasActiveDescendant(child, pathname)) || []).length > 0

  return (
    <>
      {item.showSeparatorAbove && <SidebarSeparator className="my-1" />}
      <SidebarMenu>
        <div className="flex flex-col px-2">
          <NavSidebarMenuButton
            item={item}
            isActive={isActive}
            disableTooltip={ctx.disableTooltip}
            className={ctx.itemClassName}
            activeClassName={ctx.activeItemClassName}
            onClick={() => {
              // Expand sidebar when clicking an item with children
              ctx.setOpen(true)
              // Also open the collapsible for this item
              ctx.setOpenItems(prev => ({ ...prev, [stateKey]: true }))
            }}
          />
          {/* Show dots for each sub-item only if one is active */}
          {hasActiveChild && (
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05, delayChildren: 0.1 },
                },
              }}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-0.5"
            >
              {item.children?.map((subItem) => {
                const isSubItemActive = isNavItemActive(subItem, pathname)
                return (
                  <motion.div
                    key={`collapsed-dot-${subItem.href}-${level}`}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { duration: 0.2, ease: 'easeOut' },
                      },
                    }}
                  >
                    <SidebarMenuButton
                      tooltip={subItem.title}
                      isActive={isSubItemActive}
                      className="h-6 p-0 group-data-[collapsible=icon]:h-6! group-data-[collapsible=icon]:p-0!"
                      asChild
                    >
                      <ctx.linkComponent
                        className="flex items-center justify-center"
                        {...getLinkProps(subItem.href || '')}
                        onClick={() => {
                          handleNavigation()
                        }}
                      >
                        <span
                          className={cn(
                            'size-1 rounded-full',
                            isSubItemActive ? 'bg-primary' : 'bg-sidebar-primary-foreground',
                          )}
                        />
                      </ctx.linkComponent>
                    </SidebarMenuButton>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </SidebarMenu>
      {item.showSeparatorBelow && <SidebarSeparator className="my-2" />}
    </>
  )
}

/**
 * Expanded-sidebar rendering for an item with children: a collapsible section
 * whose contents recurse into `NavMenuItem`.
 */
function NavCollapsibleItem({ item, level }: NavItemProps) {
  const ctx = useNavMenuContext()
  const { pathname, state, openItems, isInitialMount, previousOpenItems, previousState, previousPathname } = ctx
  const stateKey = getNavItemKey(item, level)
  const isActive = isNavItemActive(item, pathname)
  const hasActiveChild
    = (item.children?.filter(child => hasActiveDescendant(child, pathname)) || []).length > 0
  const isOpen = openItems[stateKey] !== undefined ? openItems[stateKey] : hasActiveChild

  return (
    <>
      {item.showSeparatorAbove && <SidebarSeparator className="my-2" />}
      <SidebarMenu className="px-2">
        <Collapsible
          key={`collapsed-item-drop-down-item-${item.title}-${level}`}
          asChild
          open={isOpen}
          onOpenChange={(open) => {
            // Allow toggling even if it has an active child
            ctx.setOpenItems(prev => ({ ...prev, [stateKey]: open }))
          }}
          className="group/collapsible"
        >
          <SidebarMenuItem className="[&>*:first-child]:w-full">
            <CollapsibleTrigger asChild className="w-full">
              <NavSidebarMenuButton
                item={item}
                isActive={isActive}
                disableTooltip={ctx.disableTooltip}
                className={ctx.itemClassName}
                activeClassName={ctx.activeItemClassName}
              >
                <span>{item.title}</span>
                <Icon
                  icon={ChevronRight}
                  className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                />
              </NavSidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
              <div style={{ minHeight: 0, overflow: 'hidden' }}>
                <motion.div
                  key={`collapsible-${stateKey}-${isOpen}`}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
                    },
                  }}
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
                  animate={isOpen ? 'visible' : 'hidden'}
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
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: { duration: 0.2, ease: 'easeOut' },
                          },
                        }}
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
            className={cn(level >= 1 && 'h-6', ctx.itemClassName)}
            activeClassName={ctx.activeItemClassName}
          >
            {item.type === 'externalLink'
              ? (
                  <a
                    href={item.href || ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {item?.icon && (
                        <Icon icon={item.icon} className="size-4 transition-all duration-300" />
                      )}
                      <span>{item.title}</span>
                    </div>
                    <Icon icon={ExternalLinkIcon} className="ml-auto size-4" />
                  </a>
                )
              : (
                  <ctx.linkComponent
                    {...getLinkProps(item.href || '')}
                    onClick={handleNavigation}
                    onMouseEnter={() => item.onPrefetch?.()}
                  >
                    {item?.icon && (
                      <Icon
                        icon={item.icon}
                        className="text-sidebar-primary transition-all duration-300"
                      />
                    )}
                    <span>{item.title}</span>
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
