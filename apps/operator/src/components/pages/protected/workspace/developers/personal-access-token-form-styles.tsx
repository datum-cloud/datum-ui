import { tv, type VariantProps } from 'tailwind-variants'

const personalAccessTokenFormStyles = tv({
  slots: {
    grid: 'grid grid-cols-2 grid-rows-2 gap-[34px] mb-[34px]',
    copyIcon: 'text-blackberry-400 cursor-pointer',
    tokenField: 'mt-[23px]',
  },
})

export type PersonalAccessTokenFormVariants = VariantProps<
  typeof personalAccessTokenFormStyles
>

export { personalAccessTokenFormStyles }
