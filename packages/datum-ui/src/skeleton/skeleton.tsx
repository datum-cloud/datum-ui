import * as React from 'react';
import { cn } from '@repo/shadcn/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('bg-muted animate-pulse rounded-md', className)}
      {...props}
    />
  )
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
