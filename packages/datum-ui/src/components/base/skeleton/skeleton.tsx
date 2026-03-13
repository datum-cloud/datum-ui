import { Skeleton as ShadcnSkeleton } from '@repo/shadcn/ui/skeleton'
import * as React from 'react'
import { cn } from '../../../utils/cn'

/**
 * Datum Skeleton component – extends shadcn Skeleton with Datum-specific styling.
 *
 * Wraps the shadcn Skeleton so you can add custom base styles here and pass
 * additional className for overrides. All standard div props are supported.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-48" />
 * <Skeleton className="h-8 w-full rounded-lg" />
 * ```
 */
function Skeleton({ ref, className, ...props }: React.ComponentProps<typeof ShadcnSkeleton> & { ref?: React.RefObject<React.ComponentRef<typeof ShadcnSkeleton> | null> }) {
  return (
    <ShadcnSkeleton
      className={cn('bg-muted-foreground/10 animate-pulse rounded-md', className)}
      {...props}
    />
  )
}

Skeleton.displayName = 'Skeleton'

export { Skeleton }
