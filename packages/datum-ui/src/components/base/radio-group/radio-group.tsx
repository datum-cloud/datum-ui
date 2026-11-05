import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { motion, useReducedMotion } from 'motion/react'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { EASE } from '../../../utils/motion'

/**
 * The selected value, mirrored from Radix so each item can animate its dot in
 * and out. `null` means there is no datum `RadioGroup` above the item (it was
 * placed in a bare Radix root), in which case the item falls back to Radix's
 * own mount/unmount and does not animate.
 */
const RadioGroupValueContext = React.createContext<string | undefined | null>(null)

function RadioGroup({
  ref,
  className,
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & { ref?: React.RefObject<React.ElementRef<typeof RadioGroupPrimitive.Root> | null> }) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolled

  const handleValueChange = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) {
        setUncontrolled(next)
      }
      onValueChange?.(next)
    },
    [onValueChange, valueProp],
  )

  return (
    <RadioGroupValueContext value={value}>
      <RadioGroupPrimitive.Root
        ref={ref}
        data-slot="radio-group"
        className={cn('grid gap-3', className)}
        value={valueProp}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        {...props}
      />
    </RadioGroupValueContext>
  )
}

RadioGroup.displayName = 'RadioGroup'

const DOT_IN = { type: 'spring', visualDuration: 0.2, bounce: 0.35 } as const
const DOT_OUT = { duration: 0.1, ease: EASE.out } as const

/**
 * RadioGroupItem renders the Radix primitive directly (not the shadcn wrapper)
 * so the dot can stay mounted and animate out as well as in. The dot pops in
 * from half size with a small spring and fades out quickly when another option
 * takes the selection. Under reduced motion it only fades.
 */
function RadioGroupItem({
  ref,
  className,
  value,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & { ref?: React.RefObject<React.ElementRef<typeof RadioGroupPrimitive.Item> | null> }) {
  const groupValue = React.use(RadioGroupValueContext)
  const reduceMotion = Boolean(useReducedMotion())
  const animated = groupValue !== null
  const visible = animated ? groupValue === value : true

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      value={value}
      data-slot="radio-group-item"
      className={cn(
        'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        'transition-[color,box-shadow,transform] duration-[var(--duration-fast)] ease-out active:scale-[0.92] disabled:active:scale-100',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        forceMount={animated ? true : undefined}
        data-slot="radio-group-indicator"
        className="flex size-full items-center justify-center"
      >
        <motion.span
          aria-hidden
          className="bg-primary size-2 rounded-full"
          initial={false}
          animate={
            visible
              ? { scale: 1, opacity: 1 }
              : { scale: reduceMotion ? 1 : 0.5, opacity: 0 }
          }
          transition={visible && !reduceMotion ? DOT_IN : DOT_OUT}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }
