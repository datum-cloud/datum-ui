import {
  RadioGroup as ShadcnRadioGroup,
  RadioGroupItem as ShadcnRadioGroupItem,
} from '@repo/shadcn/ui/radio-group'
import * as React from 'react'
import { cn } from '../../../utils/cn'

function RadioGroup({ ref, className, ...props }: React.ComponentProps<typeof ShadcnRadioGroup> & { ref?: React.RefObject<React.ElementRef<typeof ShadcnRadioGroup> | null> }) {
  return <ShadcnRadioGroup ref={ref} className={cn(className)} {...props} />
}

RadioGroup.displayName = 'RadioGroup'

function RadioGroupItem({ ref, className, ...props }: React.ComponentProps<typeof ShadcnRadioGroupItem> & { ref?: React.RefObject<React.ElementRef<typeof ShadcnRadioGroupItem> | null> }) {
  return <ShadcnRadioGroupItem ref={ref} className={cn(className)} {...props} />
}

RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }
