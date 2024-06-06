import { tv, type VariantProps } from 'tailwind-variants'

const headerStyles = tv({
  slots: {
    header:
      'bg-blackberry-800 text-white fixed left-0 right-0 top-0 z-20 dark:bg-peat-900 dark:border-b-peat-800 dark:border-b',
    nav: 'flex h-20 items-center justify-between px-4',
    mobileSidebar: 'block md:!hidden',
    userNav: 'flex items-center gap-9',
  },
})

export type HeaderVariants = VariantProps<typeof headerStyles>

export { headerStyles }
