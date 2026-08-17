import type { VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { cva } from 'class-variance-authority'

/**
 * Variants for the multi-select badges to handle different styles.
 * Uses class-variance-authority (cva) to define styles based on the `variant` prop.
 *
 * Lives in a shared module so the badge subcomponent and the top-level
 * component can both consume it without creating an import cycle.
 */
export const multiSelectVariants = cva(
  'flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'border-input-border bg-input-background/80 text-input-foreground',
        secondary: 'border-secondary/40 bg-secondary/20 text-secondary-foreground',
        destructive: 'border-destructive/60 bg-destructive/20 text-destructive',
        inverted: 'border-transparent bg-foreground text-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type MultiSelectVariant = VariantProps<typeof multiSelectVariants>['variant']

/** A single option presented by the multi-select. */
export interface MultiSelectOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}
