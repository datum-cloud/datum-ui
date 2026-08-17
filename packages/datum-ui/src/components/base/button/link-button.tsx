import type { VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { buttonVariants } from './button'
import { getIconOnlyClass } from './icon-only'

export interface LinkButtonProps
  extends
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'type'>,
  VariantProps<typeof buttonVariants> {
  /** Polymorphic component to render (defaults to native `<a>`) */
  as?: React.ElementType
  /** Destination URL — mapped to `href` for native `<a>`, `to` for router Links */
  href?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

function LinkButton({ ref, className, type, theme, size, block, icon, iconPosition = 'left', children, as: Component = 'a', href, ...props }: LinkButtonProps & { ref?: React.RefObject<HTMLAnchorElement | null> }) {
  const isIconOnly = icon && !children

  // Map href to the appropriate prop for the component:
  // - Native <a>: uses `href`
  // - Router Links (e.g. react-router Link): use `to`
  const linkProps = Component === 'a' ? { href } : { to: href }

  return (
    <Component
      className={cn(buttonVariants({ type, theme, size, block }), getIconOnlyClass(size, Boolean(isIconOnly)), className)}
      ref={ref}
      {...linkProps}
      {...props}
    >
      {isIconOnly
        ? (
            icon
          )
        : (
            <>
              {icon && iconPosition === 'left' && icon}
              {children}
              {icon && iconPosition === 'right' && icon}
            </>
          )}
    </Component>
  )
}

LinkButton.displayName = 'LinkButton'

export { LinkButton }
