'use client'

import * as React from 'react'
import { clsx } from 'clsx'

export const TextInput = React.forwardRef<HTMLInputElement, any>(
  (props, ref) => {
    return (
      <input
        className={clsx(
          `ui-w-full ui-h-10 ui-rounded-md ui-pl-2 ui-focus:outline-0 ui-dark:ui-bg-dk-surface-0 ui-bg-surface-0`,
          props.className,
        )}
        ref={ref}
        type="text"
        {...props}
      />
    )
  },
)

TextInput.displayName = 'TextInput'

export default TextInput
