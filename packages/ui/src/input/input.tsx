'use client'

import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'
import { inputStyles, type InputVariants } from './input.styles'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'>,
    InputVariants {
  icon?: ReactNode
  prefix?: ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, prefix, ...props }, ref) => {
    const { input, inputWrapper, iconWrapper, prefixWrapper } = inputStyles()
    const hasIcon = Boolean(icon)
    const hasPrefix = Boolean(prefix)
    const prefixRef = useRef<HTMLDivElement>(null)
    const [prefixWidth, setPrefixWidth] = useState(0)

    useEffect(() => {
      if (prefixRef.current) {
        setPrefixWidth(prefixRef.current.offsetWidth)
      }
    }, [prefix])

    return (
      <div className={inputWrapper({ hasIcon, hasPrefix })}>
        {prefix && (
          <div ref={prefixRef} className={prefixWrapper()}>
            {prefix}
          </div>
        )}
        <input
          type={type}
          className={cn(input({ hasIcon, hasPrefix }), className)}
          ref={ref}
          {...props}
          style={{ paddingLeft: hasPrefix ? prefixWidth + 12 : undefined }}
        />
        {icon && <div className={iconWrapper()}>{icon}</div>}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
