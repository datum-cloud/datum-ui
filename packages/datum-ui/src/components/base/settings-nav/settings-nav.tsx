import type { VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { settingsNavItemVariants } from './settings-nav-variants'

/**
 * Compact inset settings navigation for configuration pages.
 *
 * Deliberately separate from `NavMenu` / sidebar primitives — those are bound
 * to the app chrome context. SettingsNav is a page-local list: a SETTINGS
 * eyebrow, icon items with an active fill, optional error dots, Soon badges,
 * and a danger item for destructive sections.
 */

function SettingsNav({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      data-slot="settings-nav"
      aria-label="Settings"
      className={cn('flex w-full flex-col gap-1', className)}
      {...props}
    />
  )
}

function SettingsNavLabel({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="settings-nav-label"
      className={cn(
        'text-muted-foreground px-2.5 pt-1 pb-2 text-[11px] font-semibold tracking-wide uppercase',
        className,
      )}
      {...props}
    />
  )
}

export interface SettingsNavItemProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
  VariantProps<typeof settingsNavItemVariants> {
  /** When true, renders via Radix Slot so a router `Link` can own the element. */
  asChild?: boolean
  /** Leading icon (lucide or custom). Coloured by the active / danger state. */
  icon?: React.ReactNode
  /** Marks the item as the current section. */
  active?: boolean
  /** Small status dot (e.g. validation error on that section). */
  indicator?: boolean
  /** Trailing badge content, typically "Soon". */
  badge?: React.ReactNode
  disabled?: boolean
}

function SettingsNavItem({
  className,
  variant,
  asChild = false,
  icon,
  active = false,
  indicator = false,
  badge,
  disabled = false,
  children,
  href,
  onClick,
  ...props
}: SettingsNavItemProps) {
  const Comp: React.ElementType = asChild ? Slot : 'a'

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  return (
    <Comp
      data-slot="settings-nav-item"
      data-active={active || undefined}
      data-variant={variant ?? 'default'}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      href={disabled ? undefined : href}
      onClick={handleClick}
      className={cn(settingsNavItemVariants({ variant }), className)}
      {...props}
    >
      {icon
        ? (
            <span
              data-slot="settings-nav-item-icon"
              className={cn(
                'flex size-4 shrink-0 items-center justify-center [&_svg]:size-4',
                variant === 'danger'
                  ? 'text-destructive'
                  : 'text-muted-foreground transition-colors group-hover/settings-nav-item:text-primary group-data-[active=true]/settings-nav-item:text-primary',
              )}
              aria-hidden="true"
            >
              {icon}
            </span>
          )
        : null}
      <span className="min-w-0 flex-1 truncate text-left">{children}</span>
      {indicator
        ? (
            <span
              data-slot="settings-nav-item-indicator"
              className="bg-destructive size-1.5 shrink-0 rounded-full"
              aria-label="Needs attention"
            />
          )
        : null}
      {badge != null
        ? (
            <span
              data-slot="settings-nav-item-badge"
              className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
            >
              {badge}
            </span>
          )
        : null}
    </Comp>
  )
}

export { SettingsNav, SettingsNavItem, SettingsNavLabel }
