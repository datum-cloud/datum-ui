import type { VariantProps } from 'class-variance-authority'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import type { ButtonProps } from '../../base/button'
import { cva } from 'class-variance-authority'
import { cn } from '../../../utils/cn'
import miloStamp from './assets/milo-stamp.svg'
import scene5 from './assets/scene-5.png'
import scene6 from './assets/scene-6.png'
import scene7 from './assets/scene-7.png'
import { ContentAction } from './content-action'

/** Shared by every action kind: full Button surface + presentation concerns. */
interface BaseAction extends Omit<ButtonProps, 'asChild' | 'htmlType' | 'children'> {
  label: string
  /** Tooltip shown on hover/focus — pairs with `disabled` to explain why (RBAC). */
  tooltip?: ReactNode
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
  /** Skip rendering entirely (e.g. no RBAC permission to even see it). */
  hidden?: boolean
}

export interface ButtonAction extends BaseAction {
  as?: 'button'
}

export interface LinkAction
  extends BaseAction,
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | keyof BaseAction> {
  as: 'link' | 'external-link'
  to: string
}

export type EmptyContentAction = ButtonAction | LinkAction

// Container variants
const containerVariants = cva(
  'flex items-center justify-center relative overflow-hidden bg-[#F4F3F2] dark:bg-transparent',
  {
    variants: {
      variant: {
        default: 'rounded-lg border border-border',
        dashed: 'rounded-lg border border-dashed border-border',
        minimal: '',
      },
      size: {
        xs: 'h-32 p-3',
        sm: 'h-48 p-4',
        md: 'h-[226px] py-7 px-6',
        lg: 'h-80 p-8',
        xl: 'h-96 p-12',
      },
      orientation: {
        vertical: 'flex-col',
        horizontal: 'flex-row',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      orientation: 'vertical',
    },
  },
)

// Title variants
const titleVariants = cva('font-normal text-foreground text-center', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

// Subtitle variants
const subtitleVariants = cva('text-muted-foreground text-center text-xs font-normal', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-xs',
      md: 'text-xs',
      lg: 'text-sm',
      xl: 'text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

// Actions container variants
const actionsContainerVariants = cva('flex items-center flex-col', {
  variants: {
    size: {
      xs: 'gap-1',
      sm: 'gap-1',
      md: 'gap-1.5',
      lg: 'gap-2',
      xl: 'gap-3',
    },
    spacing: {
      compact: '',
      normal: '',
      relaxed: '',
    },
  },
  defaultVariants: {
    size: 'sm',
    spacing: 'normal',
  },
})

// Size to button size mapping
const BUTTON_SIZE_MAP = {
  xs: 'xs',
  sm: 'xs',
  md: 'xs',
  lg: 'default',
  xl: 'default',
} as const

/** A stable key for an action: its kind, label and position (labels can repeat). */
function actionKey(action: EmptyContentAction, position: number): string {
  return `${action.as ?? 'button'}-${action.label}-${position}`
}

export interface EmptyContentProps extends VariantProps<typeof containerVariants> {
  title?: string
  subtitle?: string
  className?: string
  actions?: EmptyContentAction[]
  spacing?: 'compact' | 'normal' | 'relaxed'
  /** User's display name for greeting (e.g., "Hey John, ..."). Defaults to "there". */
  userName?: string
  /** Link component for action links (e.g., React Router's Link). Defaults to <a>. */
  linkComponent?: React.ElementType
}

export function EmptyContent({
  title = 'No data found',
  subtitle,
  variant = 'default',
  size = 'md',
  className,
  actions = [],
  orientation = 'vertical',
  spacing = 'normal',
  userName,
  linkComponent,
}: EmptyContentProps) {
  const buttonSize = BUTTON_SIZE_MAP[size ?? 'md']
  const LinkComp = linkComponent || 'a'
  const visibleActions = actions.filter(action => !action.hidden)

  return (
    <div className={cn(containerVariants({ variant, size, orientation }), className)}>
      {/* Decorative corner images */}
      <img
        src={scene5}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-auto w-1/3 max-w-[230px] select-none"
      />
      <img
        src={scene6}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 h-auto w-1/3 max-w-[200px] select-none"
      />

      <img
        src={scene7}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-4 h-auto w-1/3 max-w-[280px] select-none"
      />

      <div className="dark:bg-background border-border relative flex max-w-[224px] flex-col items-center justify-center gap-3.5 rounded-lg border bg-white px-6 py-7">
        {title && (
          <h3 className={titleVariants({ size })}>
            {`Hey ${userName ?? 'there'}, ${title}`}
          </h3>
        )}
        {subtitle && <span className={subtitleVariants({ size })}>{subtitle}</span>}
        {visibleActions.length > 0 && (
          <div className={actionsContainerVariants({ size, spacing })}>
            {visibleActions.map((action, index) => (
              <ContentAction
                key={actionKey(action, index)}
                action={action}
                buttonSize={buttonSize}
                linkComponent={LinkComp}
              />
            ))}
          </div>
        )}

        <img
          src={miloStamp}
          alt="Milo"
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 right-2 h-auto w-7 select-none"
        />
      </div>
    </div>
  )
}
