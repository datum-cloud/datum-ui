import { tv, type VariantProps } from 'tailwind-variants'

const signupStyles = tv({
  slots: {
    separator: 'my-10',
    buttons: 'flex flex-col gap-8',
  },
})

export type SignupVariants = VariantProps<typeof signupStyles>

export { signupStyles }
