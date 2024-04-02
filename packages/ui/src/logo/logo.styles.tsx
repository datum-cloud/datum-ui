import { tv, type VariantProps } from 'tailwind-variants'

export const logoStyles = tv({
  slots: {
    base: 'block',
    icon: 'fill',
    text: 'relative w-full flex-none mb-2 text-2xl font-semibold text-stone-900 dark:text-white',
  },
  variants: {
    theme: {
      light: {
        icon: 'bg-blue-500 shadow-blue-500/50',
        text: 'peer-checked:bg-blue',
      },
      dark: {
        icon: 'bg-purple-500 shadow-purple-500/50',
        text: 'peer-checked:bg-purple',
      },
    },
  },
})

export type LogoVariants = VariantProps<typeof logoStyles>
