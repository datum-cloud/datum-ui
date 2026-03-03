import {
  Select as ShadcnSelect,
  SelectContent as ShadcnSelectContent,
  SelectGroup as ShadcnSelectGroup,
  SelectItem as ShadcnSelectItem,
  SelectLabel as ShadcnSelectLabel,
  SelectScrollDownButton as ShadcnSelectScrollDownButton,
  SelectScrollUpButton as ShadcnSelectScrollUpButton,
  SelectSeparator as ShadcnSelectSeparator,
  SelectTrigger as ShadcnSelectTrigger,
  SelectValue as ShadcnSelectValue,
} from '@repo/shadcn/ui/select'
import * as React from 'react'
import { cn } from '../../../utils/cn'

const Select = ShadcnSelect

const SelectValue = ShadcnSelectValue

function SelectGroup({ ref, className, ...props }: React.ComponentProps<typeof ShadcnSelectGroup> & { ref?: React.RefObject<React.ElementRef<typeof ShadcnSelectGroup> | null> }) {
  return <ShadcnSelectGroup ref={ref} className={cn(className)} {...props} />
}

SelectGroup.displayName = 'SelectGroup'

function SelectTrigger({ ref, className, ...props }: React.ComponentProps<typeof ShadcnSelectTrigger> & { ref?: React.RefObject<React.ElementRef<typeof ShadcnSelectTrigger> | null> }) {
  return (
    <ShadcnSelectTrigger
      ref={ref}
      className={cn(
        'rounded-lg',
        'bg-input-background/50',
        'text-input-foreground',
        'border-input-border',
        'placeholder:text-input-placeholder',
        'focus-visible:ring-0 focus-visible:ring-offset-0',
        'focus-visible:border-input-focus-border',
        'focus-visible:shadow-(--input-focus-shadow)',
        'aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

SelectTrigger.displayName = 'SelectTrigger'

function SelectContent({ ref, className, ...props }: React.ComponentProps<typeof ShadcnSelectContent> & { ref?: React.RefObject<React.ElementRef<typeof ShadcnSelectContent> | null> }) {
  return <ShadcnSelectContent ref={ref} className={cn(className)} {...props} />
}

SelectContent.displayName = 'SelectContent'

function SelectLabel({ ref, className, ...props }: React.ComponentProps<typeof ShadcnSelectLabel> & { ref?: React.RefObject<React.ElementRef<typeof ShadcnSelectLabel> | null> }) {
  return <ShadcnSelectLabel ref={ref} className={cn(className)} {...props} />
}

SelectLabel.displayName = 'SelectLabel'

function SelectItem({ ref, className, ...props }: React.ComponentProps<typeof ShadcnSelectItem> & { ref?: React.RefObject<React.ElementRef<typeof ShadcnSelectItem> | null> }) {
  return <ShadcnSelectItem ref={ref} className={cn(className)} {...props} />
}

SelectItem.displayName = 'SelectItem'

function SelectSeparator({ ref, className, ...props }: React.ComponentProps<typeof ShadcnSelectSeparator> & { ref?: React.RefObject<React.ElementRef<typeof ShadcnSelectSeparator> | null> }) {
  return <ShadcnSelectSeparator ref={ref} className={cn(className)} {...props} />
}

SelectSeparator.displayName = 'SelectSeparator'

function SelectScrollUpButton({ ref, className, ...props }: React.ComponentProps<typeof ShadcnSelectScrollUpButton> & { ref?: React.RefObject<React.ElementRef<typeof ShadcnSelectScrollUpButton> | null> }) {
  return <ShadcnSelectScrollUpButton ref={ref} className={cn(className)} {...props} />
}

SelectScrollUpButton.displayName = 'SelectScrollUpButton'

function SelectScrollDownButton({ ref, className, ...props }: React.ComponentProps<typeof ShadcnSelectScrollDownButton> & { ref?: React.RefObject<React.ElementRef<typeof ShadcnSelectScrollDownButton> | null> }) {
  return <ShadcnSelectScrollDownButton ref={ref} className={cn(className)} {...props} />
}

SelectScrollDownButton.displayName = 'SelectScrollDownButton'

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
