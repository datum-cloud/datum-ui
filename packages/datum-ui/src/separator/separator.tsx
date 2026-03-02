import * as React from 'react';
import { cn } from '@repo/shadcn/lib/utils';
import { Separator as SeparatorPrimitive } from '@repo/shadcn/ui/separator';

export interface SeparatorProps
  extends React.ComponentProps<typeof SeparatorPrimitive> {}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive>,
  SeparatorProps
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitive
    ref={ref}
    orientation={orientation}
    decorative={decorative}
    className={cn(className)}
    {...props}
  />
));

Separator.displayName = 'Separator';

export { Separator };
