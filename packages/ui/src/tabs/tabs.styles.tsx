import { tv, type VariantProps } from 'tailwind-variants'

const tabsStyles = tv({
  slots: {
    tabsList:
      'flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-blackberry-900',
    tabsTrigger:
      'flex-1 items-center justify-center whitespace-nowrap px-3 py-2 font-sans border-b border-winter-sky-900 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-sunglow-900 data-[state=active]:border-b-2 data-[state=active]:text-sunglow-900',
    tabsContent:
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  },
})

export type TabsVariants = VariantProps<typeof tabsStyles>

export { tabsStyles }
