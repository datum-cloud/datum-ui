'use client'

import React, { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { inputStyles, type InputVariants } from './input.styles'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    InputVariants {
  icon?: ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    const { input, inputWrapper, iconWrapper } = inputStyles()
    const hasIcon = icon ? true : false

    return (
      <div className={inputWrapper({ hasIcon })}>
        <input
          type={type}
          className={cn(input({ hasIcon }), className)}
          ref={ref}
          {...props}
        />
        {icon && <div className={iconWrapper()}>{icon}</div>}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
