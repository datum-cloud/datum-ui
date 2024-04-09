import { tv, type VariantProps } from 'tailwind-variants'

const loginStyles = tv({
  slots: {
    separator: 'my-10',
    buttons: 'flex flex-col gap-8',
  },
})

export type LoginVariants = VariantProps<typeof loginStyles>

export { loginStyles }
