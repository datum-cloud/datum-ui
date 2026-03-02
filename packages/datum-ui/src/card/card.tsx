import * as React from 'react';
import { cn } from '@repo/shadcn/lib/utils';
import {
  Card as CardPrimitive,
  CardHeader as CardHeaderPrimitive,
  CardTitle as CardTitlePrimitive,
  CardDescription as CardDescriptionPrimitive,
  CardContent as CardContentPrimitive,
  CardFooter as CardFooterPrimitive,
} from '@repo/shadcn/ui/card';

export interface CardProps extends React.ComponentProps<typeof CardPrimitive> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <CardPrimitive ref={ref} className={cn(className)} {...props} />
  )
);
Card.displayName = 'Card';

export interface CardHeaderProps
  extends React.ComponentProps<typeof CardHeaderPrimitive> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <CardHeaderPrimitive ref={ref} className={cn(className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export interface CardTitleProps
  extends React.ComponentProps<typeof CardTitlePrimitive> {}

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <CardTitlePrimitive ref={ref} className={cn(className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps
  extends React.ComponentProps<typeof CardDescriptionPrimitive> {}

const CardDescription = React.forwardRef<HTMLDivElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <CardDescriptionPrimitive ref={ref} className={cn(className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

export interface CardContentProps
  extends React.ComponentProps<typeof CardContentPrimitive> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <CardContentPrimitive ref={ref} className={cn(className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export interface CardFooterProps
  extends React.ComponentProps<typeof CardFooterPrimitive> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <CardFooterPrimitive ref={ref} className={cn(className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
