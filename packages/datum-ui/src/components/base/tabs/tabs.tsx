import type { VariantProps } from 'class-variance-authority'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva } from 'class-variance-authority'
import { motion } from 'motion/react'
import * as React from 'react'
import { cn } from '../../../utils/cn'

/**
 * Datum Tabs Component
 * Extends shadcn Tabs with:
 * - TabsLinkTrigger for router-agnostic link integration
 * - A `line` variant (underline page tabs) with a sliding active indicator
 * - Dark mode customizations
 */

type TabsVariant = 'default' | 'line'

interface TabsContextValue {
  /** Currently selected tab value (mirrors Radix state so triggers can animate). */
  value: string | undefined
  /** Unique per-root id so several tab bars on one page never share an indicator. */
  indicatorId: string
}

const TabsContext = React.createContext<TabsContextValue>({ value: undefined, indicatorId: 'tabs' })
const TabsVariantContext = React.createContext<TabsVariant>('default')

function Tabs({
  className,
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolled
  const indicatorId = React.useId()

  const handleValueChange = React.useCallback(
    (next: string) => {
      setUncontrolled(next)
      onValueChange?.(next)
    },
    [onValueChange],
  )

  const ctx = React.useMemo<TabsContextValue>(() => ({ value, indicatorId }), [value, indicatorId])

  return (
    <TabsContext value={ctx}>
      <TabsPrimitive.Root
        className={cn('flex flex-col gap-2', className)}
        value={valueProp}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        {...props}
      />
    </TabsContext>
  )
}

const tabsListVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      default: 'bg-muted text-muted-foreground h-9 w-fit justify-center rounded-lg p-1',
      // Underline page tabs: start-aligned, no pill, scrolls horizontally
      // when there are more tabs than fit. The baseline rule is left to
      // the surrounding layout so it can run full-bleed.
      line: 'text-foreground h-auto w-full justify-start gap-7 overflow-x-auto rounded-none bg-transparent p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface TabsListProps
  extends React.ComponentProps<typeof TabsPrimitive.List>, VariantProps<typeof tabsListVariants> {}

function TabsList({ className, variant, ...props }: TabsListProps) {
  const resolved: TabsVariant = variant ?? 'default'
  return (
    <TabsVariantContext value={resolved}>
      <TabsPrimitive.List
        data-variant={resolved}
        className={cn(tabsListVariants({ variant: resolved }), className)}
        {...props}
      />
    </TabsVariantContext>
  )
}

const tabsTriggerVariants = cva(
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-[color,box-shadow,transform,border-color] duration-[var(--duration-fast)] ease-out focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
  {
    variants: {
      variant: {
        default:
          'data-[state=active]:bg-background dark:data-[state=active]:text-foreground data-[state=active]:text-foreground dark:hover:text-foreground flex-1 rounded-md px-2 py-1 text-sm active:scale-[0.98] disabled:active:scale-100 data-[state=active]:shadow-sm',
        line: 'text-foreground hover:text-primary data-[state=active]:text-primary relative flex-none rounded-none px-0 py-2.5 text-sm font-normal data-[state=active]:font-medium focus-visible:ring-0 focus-visible:outline-hidden',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function TabsTrigger({
  className,
  value,
  children,
  asChild,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.use(TabsVariantContext)
  const { value: activeValue, indicatorId } = React.use(TabsContext)
  const isActive = variant === 'line' && activeValue === value

  const indicator = isActive
    ? (
        <motion.span
          aria-hidden
          data-slot="tabs-indicator"
          layoutId={`tabs-indicator-${indicatorId}`}
          className="bg-primary absolute inset-x-0 bottom-0 h-0.5"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )
    : null

  // With `asChild` Radix's Slot needs exactly one element, so the indicator
  // has to live inside the child (e.g. a router Link) rather than beside it.
  let content: React.ReactNode
  if (asChild && React.isValidElement<{ children?: React.ReactNode }>(children)) {
    // eslint-disable-next-line react/no-clone-element -- appending into an opaque Link child
    content = React.cloneElement(children, undefined, children.props.children, indicator)
  }
  else {
    content = (
      <>
        {children}
        {indicator}
      </>
    )
  }

  return (
    <TabsPrimitive.Trigger
      value={value}
      asChild={asChild}
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    >
      {content}
    </TabsPrimitive.Trigger>
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
export type { TabsLinkTriggerProps, TabsVariant }
