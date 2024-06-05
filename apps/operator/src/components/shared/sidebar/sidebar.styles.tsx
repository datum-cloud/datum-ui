import { tv, type VariantProps } from 'tailwind-variants'

const sidebarStyles = tv({
  slots: {
    nav: 'relative hidden h-screen border-r bg-white text-blackberry-900 border-r-winter-sky-800 md:block w-[57px] dark:bg-peat-900 dark:border-r-peat-800',
    navInner: 'relative overflow-scroll',
    expandNav:
      'absolute z-50 gap-1 flex items-center justify-center bg-white -right-[58px] w-[58px] h-[42px] bottom-0 cursor-pointer rounded-tr-lg border border-winter-sky-900  text-3xl text-blackberry-400 dark:bg-peat-900 dark:border-peat-800',
    expandNavIcon: 'rotate-180',
    sideNav:
      'text-background text-sm bg-winter-sky-900 left-8 opacity-0 transition-all duration-300 group-hover:z-50 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100',
  },
  variants: {
    status: {
      true: {
        nav: 'duration-500',
      },
    },
    isOpen: {
      true: {
        nav: 'w-72',
        expandNavIcon: 'rotate-0',
      },
    },
  },
})

export type SidebarVariants = VariantProps<typeof sidebarStyles>

export { sidebarStyles }
