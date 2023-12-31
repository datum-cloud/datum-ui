'use client'
import * as React from 'react'
import { clsx } from 'clsx'
import { Input as MInput } from '@mui/base/Input'
import type { InputProps } from '@mui/base/Input'

const resolveSlotProps = (fn: any, args: any) =>
  typeof fn === 'function' ? fn(args) : fn

export const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return (
      <MInput
        ref={ref}
        {...props}
        slotProps={{
          ...props.slotProps,
          input: (ownerState) => {
            const resolvedSlotProps = resolveSlotProps(
              props.slotProps?.input,
              ownerState,
            )
            return {
              ...resolvedSlotProps,
              className: clsx(
                `ui-w-full ui-h-10 ui-rounded-md ui-pl-2 ui-focus:outline-0 ui-dark:ui-bg-dk-surface-0 ui-bg-surface-0`,
                resolvedSlotProps?.className,
              ),
            }
          },
        }}
      />
    )
  },
)

TextInput.displayName = 'TextInput'

export default TextInput
