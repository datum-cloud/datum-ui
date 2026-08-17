import type { MultiSelectOption, MultiSelectVariant } from './multi-select-shared'
import { ChevronDown, XCircle, XIcon } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { Badge } from '../../base/badge'
import { multiSelectVariants } from './multi-select-shared'

/**
 * A keyboard-operable icon control. The badge/clear affordances live inside the
 * trigger button, so they cannot be real nested `<button>`s (invalid DOM). We
 * expose them as `role="button"` elements with a tab stop, an accessible name,
 * and Enter/Space activation so keyboard and screen-reader users can operate
 * them.
 */
function IconAction({
  label,
  onActivate,
  className,
  children,
}: {
  label: string
  onActivate: () => void
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={label}
      className={cn('inline-flex cursor-pointer items-center', className)}
      onClick={(event) => {
        event.stopPropagation()
        event.preventDefault()
        onActivate()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.stopPropagation()
          event.preventDefault()
          onActivate()
        }
      }}
    >
      {children}
    </span>
  )
}

export interface SelectedBadgeListProps {
  /** Resolved selected options, in selection order. */
  selectedOptions: MultiSelectOption[]
  /** Maximum badges to display before summarising with "+ N more". `-1` = no limit. */
  maxCount: number
  variant: MultiSelectVariant
  badgeClassName?: string
  clickableBadges: boolean
  isAnimating: boolean
  animation: number
  /** Remove a single selected value. */
  onRemove: (value: string) => void
  /** Clear the values summarised by the "+ N more" badge. */
  onClearExtra: () => void
  /** Clear every selected value. */
  onClearAll: () => void
  /** Invoked when a badge itself is clicked (only when `clickableBadges`). */
  onBadgeClick?: (option: MultiSelectOption) => void
}

/**
 * Presentational list of selected-value chips rendered inside the trigger:
 * the visible badges, an overflow "+ N more" summary, and the clear-all icon.
 */
export function SelectedBadgeList({
  selectedOptions,
  maxCount,
  variant,
  badgeClassName,
  clickableBadges,
  isAnimating,
  animation,
  onRemove,
  onClearExtra,
  onClearAll,
  onBadgeClick,
}: SelectedBadgeListProps) {
  const visibleOptions = selectedOptions.slice(0, maxCount === -1 ? undefined : maxCount)
  const overflowCount = maxCount === -1 ? 0 : selectedOptions.length - maxCount

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {visibleOptions.map((option) => {
          const IconComponent = option.icon
          return (
            <Badge
              key={option.value}
              className={cn(
                multiSelectVariants({ variant }),
                'truncate',
                isAnimating && 'animate-bounce',
                clickableBadges && 'cursor-pointer',
                badgeClassName,
              )}
              style={{ animationDuration: `${animation}s` }}
              onClick={(event) => {
                if (clickableBadges) {
                  event.stopPropagation()
                  event.preventDefault()
                  onBadgeClick?.(option)
                }
              }}
            >
              {IconComponent && (
                <IconComponent className="text-muted-foreground size-3" />
              )}
              <span className="max-w-[120px] truncate">{option.label}</span>
              <IconAction
                label={`Remove ${option.label}`}
                onActivate={() => onRemove(option.value)}
                className="text-muted-foreground ml-1"
              >
                <XCircle className="size-3" aria-hidden="true" />
              </IconAction>
            </Badge>
          )
        })}
        {overflowCount > 0 && (
          <Badge
            className={cn(
              multiSelectVariants({ variant }),
              'text-muted-foreground',
              isAnimating && 'animate-bounce',
            )}
            style={{ animationDuration: `${animation}s` }}
          >
            {`+ ${overflowCount} more`}
            <IconAction
              label="Clear extra selected"
              onActivate={onClearExtra}
              className="text-muted-foreground ml-1"
            >
              <XCircle className="size-3" aria-hidden="true" />
            </IconAction>
          </Badge>
        )}
      </div>
      <div className="flex items-center justify-between">
        <IconAction label="Clear all" onActivate={onClearAll} className="text-muted-foreground mx-2">
          <XIcon className="h-4" aria-hidden="true" />
        </IconAction>
        <span className="bg-border flex h-full min-h-6 w-px" aria-hidden="true" />
        <ChevronDown className="text-muted-foreground mx-2 h-4" aria-hidden="true" />
      </div>
    </div>
  )
}

SelectedBadgeList.displayName = 'SelectedBadgeList'
