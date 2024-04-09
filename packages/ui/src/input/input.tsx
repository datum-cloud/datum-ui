'use client'

import React from 'react'
import { cn } from '../../lib/utils'
import { inputStyles } from './input.styles'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { input } = inputStyles()
    return (
      <input
        type={type}
        className={cn(input(), className)}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
