import { tv, type VariantProps } from 'tailwind-variants'

const authStyles = tv({
  slots: {
    base: 'relative bg-blackberry-800 flex flex-col h-full w-full items-center justify-center',
    closeButton: 'absolute top-10 right-10',
    closeButtonIcon: 'h-8 w-8 z-20',
  },
})

export type AuthVariants = VariantProps<typeof authStyles>

export { authStyles }
