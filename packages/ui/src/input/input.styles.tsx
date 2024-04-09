import { tv, type VariantProps } from 'tailwind-variants'

export const inputStyles = tv({
  slots: {
    input:
      'flex h-12 w-full rounded-md border font-sans autofill:bg-white autofill:text-blackberry-500 autofill:font-sans text-blackberry-500 border-blackberry-500 bg-transparent px-3 py-none text-base transition-colors file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-blackberry-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blackberry-300 disabled:cursor-not-allowed disabled:opacity-50',
  },
})

export type InputVariants = VariantProps<typeof inputStyles>
