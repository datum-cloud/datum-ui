import * as React from 'react';
import { cn } from '@repo/shadcn/lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-lg px-3 py-2 text-base md:text-sm',
          'border border-input-border bg-input-background/50 text-input-foreground',
          'placeholder:text-input-placeholder',
          'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
          'focus-visible:border-input-focus-border focus-visible:shadow-(--input-focus-shadow)',
          'read-only:cursor-not-allowed read-only:opacity-50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
