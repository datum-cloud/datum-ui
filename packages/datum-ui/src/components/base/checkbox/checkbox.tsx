import { Checkbox as ShadcnCheckbox } from '@repo/shadcn/ui/checkbox'
import * as React from 'react'
import { cn } from '../../../utils/cn'

function Checkbox({ ref, className, ...props }: React.ComponentProps<typeof ShadcnCheckbox> & { ref?: React.RefObject<React.ElementRef<typeof ShadcnCheckbox> | null> }) {
  return <ShadcnCheckbox ref={ref} className={cn(className)} {...props} />
}

Checkbox.displayName = 'Checkbox'

export { Checkbox }
