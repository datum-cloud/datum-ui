import { tv, type VariantProps } from 'tailwind-variants'

const dashboardStyles = tv({
  slots: {
    base: 'flex h-screen border-collapse overflow-hidden',
    main: 'flex-1 overflow-y-auto overflow-x-hidden p-10 pt-44 pb-24 bg-secondary/10',
  },
})

export type DashboardVariants = VariantProps<typeof dashboardStyles>

export { dashboardStyles }
