import * as React from 'react';
import { cn } from '@repo/shadcn/lib/utils';
import {
  Select as SelectPrimitive,
  SelectGroup,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectTrigger as SelectTriggerPrimitive,
} from '@repo/shadcn/ui/select';

// Pass-through sub-components (no Datum overrides needed)
export {
  SelectGroup,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};

// Select root — pass-through
const Select = SelectPrimitive;

// SelectTrigger — Datum-styled with size prop
export interface SelectTriggerProps
  extends React.ComponentProps<typeof SelectTriggerPrimitive> {
  size?: 'sm' | 'default';
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectTriggerPrimitive>,
  SelectTriggerProps
>(({ className, size = 'default', children, ...props }, ref) => (
  <SelectTriggerPrimitive
    ref={ref}
    data-size={size}
    className={cn(
      // Datum border/background/text tokens (override shadcn base via tailwind-merge)
      'rounded-lg border-input-border bg-input-background/50 text-input-foreground',
      // Datum placeholder token
      'data-[placeholder]:text-input-placeholder',
      // Datum focus tokens (override shadcn's ring-based focus)
      'focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0',
      'focus-visible:border-input-focus-border focus-visible:shadow-(--input-focus-shadow)',
      // Size via data attribute — min-h-0 overrides shadcn's min-h-10 so data-size heights take effect
      'min-h-0 data-[size=default]:h-9 data-[size=sm]:h-8',
      className
    )}
    {...props}
  >
    {children}
  </SelectTriggerPrimitive>
));

SelectTrigger.displayName = 'SelectTrigger';

export { Select, SelectTrigger };
