import { tv, type VariantProps } from 'tailwind-variants'

const sidebarNavStyles = tv({
  slots: {
    nav: 'space-y-1',
    icon: 'h-5 w-5 text-blackberry-400',
    linkLabel:
      'font-normal absolute left-12 text-base text-nowrap duration-200',
    accordionTrigger:
      'group relative flex h-12 justify-between px-4 py-2 text-base duration-200 hover:bg-muted hover:no-underline',
    link: 'font-sans px-4 py-2 group relative flex h-12 justify-start items-center',
    accordionItem: 'border-none',
    expandArrow:
      'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
  },
  variants: {
    isCurrent: {
      true: {
        link: 'rounded-md bg-winter-sky-800 font-bold hover:bg-muted',
      },
    },
  },
})

export type SidebarNavigationVariants = VariantProps<typeof sidebarNavStyles>

export { sidebarNavStyles }
