import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import type { NavItem } from './types'
import { cn } from '../../../../utils/cn'
import { SidebarMenuButton } from '../../../base/sidebar'
import { Icon } from '../../../icons/icon-wrapper'

// Centralized style constants for nav menu buttons
export const NAV_STYLES = {
  /**
   * Side inset of every row. With the button's own px-2 it puts each icon 16px
   * from the edge, which centres it in the 48px icon rail, so icons hold still
   * while the sidebar collapses and expands.
   */
  rowInset: 'px-2',
  /**
   * Labels, badges and chevrons fade out in the icon rail instead of dropping
   * out of the layout, so collapsing reads as the sidebar narrowing over them
   * rather than the row snapping to its rail shape before the width moves.
   * They also stop shrinking, so a label clips at the edge with its badge
   * instead of truncating to "Co…" beside a full-width badge.
   */
  railFade: 'transition-opacity duration-150 group-data-[collapsible=icon]:shrink-0 group-data-[collapsible=icon]:opacity-0',
  /**
   * Row wrapper. A flex column, so the tooltip's inline wrapper never sits on a
   * text baseline: in the icon rail the label is hidden, and the descender space
   * under that baseline would make each rail row taller than its expanded twin.
   */
  menuItem: 'flex flex-col [&>*:first-child]:w-full',
  menuButton:
    'rounded-xl h-8 font-normal text-xs transition-all px-2 py-1 group-data-[collapsible=icon]:w-full! data-[active=true]:bg-sidebar data-[active=true]:text-foreground data-[active=true]:text-sidebar-primary data-[active=true]:[&>svg]:text-primary hover:bg-sidebar hover:text-sidebar-primary hover:[&>svg]:text-sidebar-primary hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent hover:font-semibold data-[active=true]:hover:[&>svg]:text-sidebar-primary transition-colors duration-300 gap-2.5 text-foreground [&>svg]:text-icon-primary',
  disabled: 'pointer-events-none opacity-50',
  icon: 'duration-300 transition-all',
  iconSmall: 'size-4 duration-300 transition-all',
} as const

// Centralized icon renderer component
export function NavIcon({
  icon: IconComponent,
  className,
  size = 'default',
}: {
  icon?: LucideIcon
  className?: string
  size?: 'default' | 'small'
}) {
  if (!IconComponent)
    return null
  return (
    <Icon
      icon={IconComponent}
      className={cn(size === 'small' ? NAV_STYLES.iconSmall : NAV_STYLES.icon, className)}
    />
  )
}

NavIcon.displayName = 'NavIcon'

// Wrapper component for NavSidebarMenuButton
export type NavSidebarMenuButtonProps = ComponentProps<typeof SidebarMenuButton> & {
  item: Pick<NavItem, 'disabled' | 'icon' | 'title'>
  isActive?: boolean
  disableTooltip?: boolean
  /** Extra classes applied only when isActive is true. Composed after base + className. */
  activeClassName?: string
}

export function NavSidebarMenuButton({ ref, item, isActive, disableTooltip, className, activeClassName, children, asChild, ...props }: NavSidebarMenuButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) {
  return (
    <SidebarMenuButton
      ref={ref}
      tooltip={disableTooltip ? undefined : item.title}
      isActive={isActive}
      disabled={item.disabled}
      asChild={asChild}
      className={cn(
        NAV_STYLES.menuButton,
        item.disabled && NAV_STYLES.disabled,
        className,
        isActive && activeClassName,
      )}
      {...props}
    >
      {asChild
        ? (
            children
          )
        : (
            <>
              <NavIcon icon={item.icon} />
              {children}
            </>
          )}
    </SidebarMenuButton>
  )
}

NavSidebarMenuButton.displayName = 'NavSidebarMenuButton'
