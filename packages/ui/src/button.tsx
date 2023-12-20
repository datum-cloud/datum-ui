'use client'

import React from 'react'
import clsx from 'clsx'
import { Button as MButton, ButtonProps } from '@mui/base/Button'

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { className, children, onClick, ...rest } = props
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

export default Button
