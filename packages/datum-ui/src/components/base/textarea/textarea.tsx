import { Textarea as ShadcnTextarea } from '@repo/shadcn/ui/textarea'
import * as React from 'react'
import { cn } from '../../../utils/cn'

function Textarea({ ref, className, ...props }: React.ComponentProps<'textarea'> & { ref?: React.RefObject<HTMLTextAreaElement | null> }) {
  return (
    <ShadcnTextarea
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

Textarea.displayName = 'Textarea'

export { Textarea }
