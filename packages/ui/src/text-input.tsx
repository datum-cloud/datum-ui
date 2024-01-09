'use client'

import * as React from 'react'
import { clsx } from 'clsx'

export const TextInput = React.forwardRef<HTMLInputElement, any>(
  (props, ref) => {
    return (
      <input
        className={clsx(
          `!ui-w-full !ui-h-10 !ui-rounded-md !ui-pl-2 !ui-ring-blackberry-800 dark:!ui-peat-800 focus:!outline-0 dark:!ui-text-white !ui-text-blackberry-800 dark:!ui-bg-peat-900 !ui-bg-blackberry-50 border !ui-border-blackberry-200 dark:!ui-border-peat-700`,
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
