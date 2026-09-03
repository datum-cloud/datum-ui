import {
  HoverCardContent as ShadcnHoverCardContent,
  HoverCard as ShadcnHoverCardRoot,
  HoverCardTrigger as ShadcnHoverCardTrigger,
} from '@repo/shadcn/ui/hover-card'
import * as React from 'react'
import { cn } from '../../../utils/cn'

/**
 * Datum HoverCard
 *
 * Thin wrapper over the shadcn hover card. Standardises `HoverCardContent`
 * motion on the shared fast/ease-out tokens (shadcn already sets the
 * trigger-anchored transform-origin). Root/Trigger pass through unchanged.
 */

const HoverCard = ShadcnHoverCardRoot
const HoverCardTrigger = ShadcnHoverCardTrigger

function HoverCardContent({
  className,
  ...props
}: React.ComponentProps<typeof ShadcnHoverCardContent>) {
  return (
    <ShadcnHoverCardContent
      className={cn('duration-[var(--duration-fast)] ease-out', className)}
      {...props}
    />
  )
}

export { HoverCard, HoverCardContent, HoverCardTrigger }
