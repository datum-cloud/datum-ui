import { tv, type VariantProps } from 'tailwind-variants'

export const logoStyles = tv({
  slots: {
    base: 'block max-w-full max-h-full',
    icon: 'fill-sunglow-900',
    text: 'fill-blackberry-800',
  },
  variants: {
    theme: {
      light: {
        icon: 'fill-sunglow-900',
        text: 'fill-blackberry-800',
      },
      dark: {
        icon: 'fill-sunglow-900',
        text: 'fill-white',
      },
      blackberry: {
        icon: 'fill-blackberry-800',
        text: 'fill-blackberry-800',
      },
      sunglow: {
        icon: 'fill-sunglow-900',
        text: 'fill-sunglow-900',
      },
      white: {
        icon: 'fill-white',
        text: 'fill-white',
      },
    },
  },
})

export type LogoVariants = VariantProps<typeof logoStyles>
