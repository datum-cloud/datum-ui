import type { VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '../../../utils/cn'

/**
 * Compact inset settings navigation for configuration pages.
 *
 * Deliberately separate from `NavMenu` / sidebar primitives — those are bound
 * to the app chrome context. SettingsNav is a page-local list: a SETTINGS
 * eyebrow, icon items with an active fill, optional error dots, Soon badges,
 * and a danger item for destructive sections.
 */

const settingsNavItemVariants = cva(
  // `aria-disabled` (not `disabled:`) — this renders as an `<a>`, which has
  // no `:disabled` state. The click handler still calls preventDefault.
  'group/settings-nav-item relative flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-normal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-disabled:pointer-events-none aria-disabled:opacity-50',
  {
    variants: {
      variant: {
        // Hover uses a primary tint (not `muted`, which is near-invisible on
        // the light theme's background) so it reads as a lighter step of the
        // active fill.
        default:
          'text-foreground hover:bg-primary/5 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary',
        danger:
          'text-destructive hover:bg-destructive/10 data-[active=true]:bg-destructive/10 data-[active=true]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

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
        'text-muted-foreground px-2.5 pt-1 pb-2 text-3xs font-semibold tracking-wide uppercase',
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
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  const label = (
    asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
      ? children.props.children
      : children
  )

  const content = (
    <>
      {icon
        ? (
            <span
              data-slot="settings-nav-item-icon"
              className="flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-colors group-hover/settings-nav-item:text-primary group-data-[active=true]/settings-nav-item:text-primary group-data-[variant=danger]/settings-nav-item:!text-destructive [&_svg]:size-4"
              aria-hidden="true"
            >
              {icon}
            </span>
          )
        : null}
      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
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
              className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-4xs font-semibold tracking-wide uppercase"
            >
              {badge}
            </span>
          )
        : null}
    </>
  )

  const itemClassName = cn(settingsNavItemVariants({ variant }), className)
  const itemProps = {
    'data-slot': 'settings-nav-item',
    'data-active': active || undefined,
    'data-variant': variant ?? 'default',
    'aria-current': active ? ('page' as const) : undefined,
    'aria-disabled': disabled || undefined,
    'tabIndex': disabled ? -1 : undefined,
    'onClick': handleClick,
    'className': itemClassName,
    ...props,
  }

  // With `asChild` Radix's Slot needs exactly one element, so icon / label /
  // indicator / badge have to live inside the child (e.g. a router Link)
  // rather than beside it.
  if (asChild && React.isValidElement(children)) {
    // eslint-disable-next-line react/no-clone-element -- appending into an opaque Link child
    const slotted = React.cloneElement(children, undefined, content)
    return (
      <Slot {...itemProps}>
        {slotted}
      </Slot>
    )
  }

  return (
    <a href={disabled ? undefined : href} {...itemProps}>
      {content}
    </a>
  )
}

export { SettingsNav, SettingsNavItem, SettingsNavLabel }
