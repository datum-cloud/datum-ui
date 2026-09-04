import {
  PopoverAnchor as ShadcnPopoverAnchor,
  PopoverContent as ShadcnPopoverContent,
  Popover as ShadcnPopoverRoot,
  PopoverTrigger as ShadcnPopoverTrigger,
} from '@repo/shadcn/ui/popover'
import * as React from 'react'
import { cn } from '../../../utils/cn'

/**
 * Datum Popover
 *
 * Thin wrapper over the shadcn popover. Adds trigger-anchored motion to
 * `PopoverContent` (scale from the trigger, not the centre) with the shared
 * fast/ease-out motion tokens. Root/Trigger/Anchor are passed through
 * unchanged so this stays a drop-in replacement.
 */

const Popover = ShadcnPopoverRoot
const PopoverTrigger = ShadcnPopoverTrigger
const PopoverAnchor = ShadcnPopoverAnchor

function PopoverContent({
  className,
  ...props
}: React.ComponentProps<typeof ShadcnPopoverContent>) {
  return (
    <ShadcnPopoverContent
      className={cn(
        'origin-(--radix-popover-content-transform-origin) duration-[var(--duration-fast)] ease-out',
        className,
      )}
      {...props}
    />
  )
}

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger }
