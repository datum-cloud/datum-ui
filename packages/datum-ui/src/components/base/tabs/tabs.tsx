import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'
import { cn } from '../../../utils/cn'

/**
 * Datum Tabs Component
 * Extends shadcn Tabs with:
 * - TabsLinkTrigger for router-agnostic link integration
 * - Dark mode customizations
 */

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn('flex flex-col gap-2', className)} {...props} />
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'data-[state=active]:bg-background dark:data-[state=active]:text-foreground data-[state=active]:text-foreground dark:hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('flex-1 outline-none', className)} {...props} />
}

interface TabsLinkTriggerProps extends React.ComponentProps<typeof TabsPrimitive.Trigger> {
  /** Destination URL — mapped to `href` for native `<a>`, `to` for router Links */
  href: string
  /** Link component to use (defaults to native `<a>`) */
  linkComponent?: React.ElementType
}

function TabsLinkTrigger({
  value,
  href,
  linkComponent: LinkComp = 'a',
  children,
  className,
  ...props
}: TabsLinkTriggerProps) {
  // Map href to the appropriate prop for the component
  const linkProps = LinkComp === 'a' ? { href } : { to: href }

  return (
    <TabsTrigger value={value} asChild className={className} {...props}>
      <LinkComp {...linkProps}>{children}</LinkComp>
    </TabsTrigger>
  )
}

export { Tabs, TabsContent, TabsLinkTrigger, TabsList, TabsTrigger }
export type { TabsLinkTriggerProps }
