import { tv, type VariantProps } from 'tailwind-variants'

const authStyles = tv({
  slots: {
    base: 'relative bg-blackberry-800 flex flex-col h-full w-full items-center justify-center',
    closeButton: 'absolute top-10 right-10',
    closeButtonIcon: 'h-8 w-8 z-20',
    bg: 'absolute h-full w-2/3 top-0 left-0',
    bgImage: 'object-cover h-full z-10',
    content:
      'relative z-20 bg-white shadow-auth rounded-lg flex flex-col justify-center mx-auto my-auto p-6 sm:w-1/3',
  },
})

export type AuthVariants = VariantProps<typeof authStyles>

export { authStyles }
