import * as React from 'react';
import { cn } from '@repo/shadcn/lib/utils';

export interface TextareaProps extends React.ComponentProps<'textarea'> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        data-slot="textarea"
        ref={ref}
        className={cn(
          'flex w-full field-sizing-content min-h-16 rounded-lg px-3 py-2 text-base md:text-sm',
          'border border-input-border bg-input-background/50 text-input-foreground',
          'placeholder:text-input-placeholder',
          'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
          'focus-visible:border-input-focus-border focus-visible:shadow-(--input-focus-shadow)',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-[color,box-shadow]',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
