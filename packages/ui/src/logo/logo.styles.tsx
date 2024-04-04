import { tv, type VariantProps } from 'tailwind-variants'

export const logoStyles = tv({
  slots: {
    base: 'block max-w-full max-h-full',
    icon: 'fill-sunglow-900',
    text: 'fill-white',
  },
  variants: {
    theme: {
      light: {
        icon: 'fill-blackberry-800',
      },
      dark: {
        icon: 'fill-sunglow-900',
        text: 'fill-blackberry-800',
      },
    },
  },
})

export type LogoVariants = VariantProps<typeof logoStyles>
