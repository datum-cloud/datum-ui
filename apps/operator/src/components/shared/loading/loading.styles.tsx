import { tv, type VariantProps } from 'tailwind-variants'

const loadingStyles = tv({
  slots: {
    loader: 'h-full w0full rounded bg-white dark:bg-peat-800 animate-pulse',
  },
})

export type LoadingVariants = VariantProps<typeof loadingStyles>

export { loadingStyles }
