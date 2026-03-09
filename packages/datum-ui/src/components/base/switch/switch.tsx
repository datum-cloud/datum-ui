import { Switch as ShadcnSwitch } from '@repo/shadcn/ui/switch'
import * as React from 'react'
import { cn } from '../../../utils/cn'

function Switch({ ref, className, ...props }: React.ComponentProps<typeof ShadcnSwitch> & { ref?: React.RefObject<React.ElementRef<typeof ShadcnSwitch> | null> }) {
  return <ShadcnSwitch ref={ref} className={cn(className)} {...props} />
}

Switch.displayName = 'Switch'

export { Switch }
