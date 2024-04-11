import { tv, type VariantProps } from 'tailwind-variants'

const headerStyles = tv({
  slots: {
    header: 'bg-blackberry-800 text-white fixed left-0 right-0 top-0 z-20',
    nav: 'flex h-20 items-center justify-between px-4',
    logoWrapper: 'hidden items-center justify-between gap-2 md:flex',
    mobileSidebar: 'block md:!hidden',
    userNav: 'flex items-center gap-2',
  },
})

export type HeaderVariants = VariantProps<typeof headerStyles>

export { headerStyles }
