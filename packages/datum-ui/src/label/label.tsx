import * as React from 'react';
import { cn } from '@repo/shadcn/lib/utils';
import { Label as LabelPrimitive } from '@repo/shadcn/ui/label';

export interface LabelProps
  extends React.ComponentProps<typeof LabelPrimitive> {}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive>,
  LabelProps
>(({ className, ...props }, ref) => (
  <LabelPrimitive
    ref={ref}
    className={cn(className)}
    {...props}
  />
));

Label.displayName = 'Label';

export { Label };
