'use client'

import * as React from 'react'
import { clsx } from 'clsx'
import { Button as MButton } from '@mui/base/Button'
import type { ButtonProps } from '@mui/base/Button'

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props) => {
    const { className, children, ...rest } = props
    return (
      <MButton
        {...rest}
        className={clsx(
          `ui-px-4 ui-py-3 ui-bg-orange-0 ui-rounded-md ui-text-white`,
          className,
        )}
      >
        {children}
      </MButton>
    )
  },
)

Button.displayName = 'Button'

export default Button
