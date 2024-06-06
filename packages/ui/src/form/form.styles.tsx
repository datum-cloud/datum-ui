import { tv, type VariantProps } from 'tailwind-variants'

export const formStyles = tv({
  slots: {
    formItem: 'space-y-2',
    formLabelError: 'text-red-500 dark:text-red-900',
    formDescription: 'text-sm text-slate-500 dark:text-slate-400',
    formMessage: 'text-sm font-medium text-red-500 dark:text-red-900',
  },
})

export type FormVariants = VariantProps<typeof formStyles>
