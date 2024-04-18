'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import { forwardRef } from 'react'
import { tv } from 'tailwind-variants'

const label = tv({
  base: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
})

const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={label() + (className ? ` ${className}` : '')}
    {...props}
  />
))

Label.displayName = LabelPrimitive.Root.displayName

export { Label }
