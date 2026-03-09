import { Input as ShadcnInput } from '@repo/shadcn/ui/input'
import * as React from 'react'
import { cn } from '../../../utils/cn'

function Input({ ref, className, ...props }: React.ComponentProps<'input'> & { ref?: React.RefObject<HTMLInputElement | null> }) {
  return (
    <ShadcnInput
      ref={ref}
      className={cn(
        'rounded-lg',
        'bg-input-background/50',
        'text-input-foreground',
        'border-input-border',
        'placeholder:text-input-placeholder',
        'focus-visible:ring-0 focus-visible:ring-offset-0',
        'focus-visible:border-input-focus-border',
        'focus-visible:shadow-(--input-focus-shadow)',
        'aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

Input.displayName = 'Input'

export { Input }
