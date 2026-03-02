import * as React from 'react';
import { cn } from '@repo/shadcn/lib/utils';
import { Checkbox as CheckboxPrimitive } from '@repo/shadcn/ui/checkbox';

export interface CheckboxProps
  extends React.ComponentProps<typeof CheckboxPrimitive> {}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive>,
  CheckboxProps
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive
    ref={ref}
    className={cn(className)}
    {...props}
  />
));

Checkbox.displayName = 'Checkbox';

export { Checkbox };
