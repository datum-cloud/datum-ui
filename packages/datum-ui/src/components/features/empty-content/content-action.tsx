import type { VariantProps } from 'class-variance-authority'
import type { ElementType, ReactNode } from 'react'
import type { ButtonProps } from '../../base/button'
import type { ButtonAction, EmptyContentAction, LinkAction } from './empty-content'
import { cva } from 'class-variance-authority'
import { cn } from '../../../utils/cn'
import { Button } from '../../base/button'
import { Tooltip } from '../../base/tooltip'

// Action button variants
const actionButtonVariants = cva('flex items-center gap-1', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-xs',
      md: 'text-xs',
      lg: 'text-sm',
      xl: 'text-sm',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

// Button size back to the nearest container size (for actionButtonVariants text class)
const BUTTON_SIZE_TO_CONTAINER: Record<
  NonNullable<ButtonProps['size']>,
  NonNullable<VariantProps<typeof actionButtonVariants>['size']>
> = {
  xs: 'xs',
  small: 'sm',
  default: 'lg',
  large: 'xl',
  icon: 'md',
  link: 'md',
}

interface ContentActionProps {
  action: EmptyContentAction
  buttonSize: ButtonProps['size']
  /** Link component for link actions. Defaults to <a>. */
  linkComponent?: ElementType
}

/** One action button or link, shared by EmptyContent and ErrorContent. */
export function ContentAction({ action, buttonSize, linkComponent: LinkComp = 'a' }: ContentActionProps) {
  const renderAsLink
    = (action.as === 'link' || action.as === 'external-link') && !action.disabled

  // Strip all non-Button keys (meta + anchor) so only Button props reach <Button>.
  const {
    as: _as,
    label,
    tooltip,
    tooltipSide,
    hidden: _hidden,
    to,
    target,
    rel,
    download,
    hrefLang,
    referrerPolicy,
    ping,
    type = 'secondary',
    size: sizeOverride,
    className: actionClassName,
    ...buttonProps
  } = action as ButtonAction & Partial<LinkAction>

  const resolvedSize = sizeOverride ?? buttonSize
  const wrapperSize = BUTTON_SIZE_TO_CONTAINER[resolvedSize ?? 'xs'] ?? 'md'

  const button = (
    <Button
      type={type}
      size={resolvedSize}
      className={cn(actionButtonVariants({ size: wrapperSize }), actionClassName)}
      {...buttonProps}
    >
      {label}
    </Button>
  )

  let control: ReactNode = button

  if (renderAsLink) {
    const isExternal = action.as === 'external-link'
    const linkHref = LinkComp === 'a' ? { href: to ?? '' } : { to: to ?? '' }
    control = (
      <LinkComp
        {...linkHref}
        target={target ?? (isExternal ? '_blank' : '_self')}
        rel={isExternal ? 'noopener noreferrer' : rel}
        download={download}
        hrefLang={hrefLang}
        referrerPolicy={referrerPolicy}
        ping={ping}
      >
        {button}
      </LinkComp>
    )
  }

  if (tooltip) {
    control = (
      <Tooltip message={tooltip} side={tooltipSide}>
        <span className="inline-flex">{control}</span>
      </Tooltip>
    )
  }

  return control
}
