import { cn } from '../../../../utils/cn'
import { Tooltip } from '../../../base/tooltip'

interface ToolbarButtonProps {
  active?: boolean
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  tooltip?: string
  shortcut?: string
  children: React.ReactNode
  className?: string
}

export function ToolbarButton({ ref, active, disabled, onClick, tooltip, children, className }: ToolbarButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) {
  const button = (
    <button
      ref={ref}
      type="button"
      // preventDefault on mousedown suppresses focus transfer so the editor
      // keeps its selection. The native click still fires afterward, so
      // onClick is wired directly instead of synthesized from mousedown —
      // which lets Popover/Slot composers (ResponsivePopover asChild, etc.)
      // merge their own onClick with a real MouseEvent.
      onMouseDown={(e) => {
        e.preventDefault()
      }}
      onClick={onClick}
      disabled={disabled}
      // The tooltip is only a description while open, never an accessible name,
      // so expose it as aria-label. aria-pressed is emitted only for toggle
      // buttons (those that pass a boolean `active`); trigger-style buttons
      // (e.g. the link popover opener) leave `active` undefined and stay plain.
      aria-label={tooltip}
      aria-pressed={active}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded',
        'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        'disabled:pointer-events-none disabled:opacity-50',
        'transition-colors',
        active && 'bg-accent text-accent-foreground',
        className,
      )}
    >
      {children}
    </button>
  )

  if (!tooltip)
    return button

  return <Tooltip message={tooltip}>{button}</Tooltip>
}

ToolbarButton.displayName = 'ToolbarButton'
