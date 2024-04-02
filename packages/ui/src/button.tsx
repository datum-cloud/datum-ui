'use client'

import * as React from 'react'
import { clsx } from 'clsx'

export const Button = React.forwardRef<HTMLButtonElement, any>((props, ref) => {
  const { className, loading, children, ...rest } = props
  return (
    <button
      {...rest}
      className={clsx(
        `!px-4 !py-3 !bg-sunglow-900 !rounded-md disabled:opacity-25`,
        className,
      )}
      disabled={loading}
      ref={ref}
      type={rest.type ? rest.type : 'submit'}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
