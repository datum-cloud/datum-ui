import { type ReactNode, type ButtonHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const buttonStyles = tv({
  base: 'font-mono inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md leading-none text-sm ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      sunglow: 'bg-sunglow-900 text-slate-50 bg-opacity-10',
    },
    iconPosition: {
      left: 'flex-row-reverse',
    },
    size: {
      default: 'h-14 px-7 text-lg',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10 px-0 py-0',
    },
  },
  defaultVariants: {
    variant: 'sunglow',
    size: 'default',
  },
})

type ButtonVariants = VariantProps<typeof buttonStyles>

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  asChild?: boolean
  icon?: ReactNode
}
