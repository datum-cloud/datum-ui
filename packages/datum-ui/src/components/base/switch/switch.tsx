import * as SwitchPrimitive from '@radix-ui/react-switch'
import { CheckIcon, XIcon } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../utils/cn'

/**
 * Switch renders the Radix primitive directly rather than wrapping the shadcn
 * one, because its state glyphs go inside the thumb. Building it here keeps the
 * shadcn base untouched, so that base can be regenerated from upstream without
 * losing anything of ours.
 */
function Switch({ ref, className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root> & { ref?: React.RefObject<React.ElementRef<typeof SwitchPrimitive.Root> | null> }) {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="switch"
      className={cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        // Explicit transition properties + motion tokens, rather than the
        // blanket `transition-all` the shadcn base uses.
        'transition-[background-color,border-color,box-shadow] duration-[var(--duration-fast)] ease-out',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // The glyph colour mirrors the thumb's own background conditionals so
          // it stays legible in every combination. The dark checked thumb is
          // the one that inverts: it uses primary-foreground, which is dark.
          'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground text-muted-foreground dark:data-[state=unchecked]:text-background dark:data-[state=checked]:text-primary group pointer-events-none flex size-5 items-center justify-center rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%+2px)] data-[state=unchecked]:translate-x-0',
        )}
      >
        {/* Decorative: state already reaches assistive tech through role="switch"
            and aria-checked. These exist so sighted users can read on/off from
            the glyph rather than from thumb position and colour alone. */}
        <XIcon aria-hidden className="size-3 group-data-[state=checked]:hidden" />
        <CheckIcon aria-hidden className="hidden size-3 group-data-[state=checked]:block" />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

Switch.displayName = 'Switch'

export { Switch }
