import * as React from 'react';
import { cn } from '@repo/shadcn/lib/utils';
import {
  Tabs as TabsPrimitive,
  TabsList as TabsListPrimitive,
  TabsTrigger as TabsTriggerPrimitive,
  TabsContent as TabsContentPrimitive,
} from '@repo/shadcn/ui/tabs';

export interface TabsProps
  extends React.ComponentProps<typeof TabsPrimitive> {}

// Tabs root — pass-through
const Tabs = TabsPrimitive;

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsListPrimitive> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsListPrimitive>,
  TabsListProps
>(({ className, ...props }, ref) => (
  <TabsListPrimitive ref={ref} className={cn(className)} {...props} />
));
TabsList.displayName = 'TabsList';

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsTriggerPrimitive> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsTriggerPrimitive>,
  TabsTriggerProps
>(({ className, ...props }, ref) => (
  <TabsTriggerPrimitive ref={ref} className={cn(className)} {...props} />
));
TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsContentPrimitive> {}

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsContentPrimitive>,
  TabsContentProps
>(({ className, ...props }, ref) => (
  <TabsContentPrimitive ref={ref} className={cn(className)} {...props} />
));
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
