import { CardContent, CardDescription, CardTitle } from '@repo/shadcn/ui/card'
import * as React from 'react'
import { cn } from '../../../utils/cn'

/**
 * Datum Card Component
 * Extends shadcn Card with custom default className
 *
 * This component replaces the default className of shadcn Card without modifying
 * the original shadcn component. All sub-components (CardHeader, CardTitle, etc.)
 * are re-exported from shadcn as-is.
 */

const DEFAULT_CARD_CLASSNAME
  = 'bg-card text-card-foreground flex flex-col gap-4 rounded-xl border border-card-border py-6 shadow'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card" className={cn(DEFAULT_CARD_CLASSNAME, className)} {...props} />
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn('border-card-border flex flex-col gap-3 px-6', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-footer" className={cn('border-card-border px-6', className)} {...props} />
  )
}

export { CardContent, CardDescription, CardFooter, CardTitle }
export { Card, CardHeader }
