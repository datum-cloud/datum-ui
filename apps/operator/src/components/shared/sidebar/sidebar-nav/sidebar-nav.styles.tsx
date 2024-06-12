import { tv, type VariantProps } from 'tailwind-variants'

const sidebarNavStyles = tv({
  slots: {
    nav: 'space-y-1 bg-white dark:bg-peat-900 h-screen relative overflow-y-auto overflow-x-visible pt-24 pb-8 tracking-tighter',
    icon: 'h-5 w-5 text-blackberry-400 dark:text-peat-400',
    linkLabel:
      'font-normal absolute left-12 text-base text-nowrap duration-200',
    accordionTrigger:
      'group relative flex h-[2.2rem] justify-between px-4 py-2 text-base duration-200 hover:bg-muted hover:no-underline dark:text-peat-400',
    link: 'font-sans px-4 py-2 group relative flex h-[2.2rem] justify-start items-center dark:text-peat-400',
    accordionItem: 'border-none ',
    separator: '!my-4',
    heading:
      'text-sunglow-900 font-mono px-4 py-2 uppercase font-bold tracking-[0.42px] text-sm',
  },
  variants: {
    isCurrent: {
      true: {
        link: 'rounded-md bg-winter-sky-800 font-bold hover:bg-muted dark:bg-peat-800',
      },
    },
  },
})

export type SidebarNavigationVariants = VariantProps<typeof sidebarNavStyles>

export { sidebarNavStyles }
