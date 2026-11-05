import type { CheckedState } from '@radix-ui/react-checkbox'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { motion, useReducedMotion } from 'motion/react'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { DURATION, EASE } from '../../../utils/motion'
import { useControllableState } from '../hooks'

const CHECK_PATH = 'M20 6 9 17l-5-5'
const DASH_PATH = 'M5 12h14'

/**
 * One stroke of the indicator. Drawn on with `pathLength` when it appears and
 * faded out (faster) when it leaves. Under reduced motion the stroke is not
 * drawn, only faded, since the draw reads as movement.
 */
function IndicatorMark({ d, visible, reduceMotion }: { d: string, visible: boolean, reduceMotion: boolean }) {
  return (
    <motion.path
      d={d}
      initial={false}
      animate={
        visible
          ? { pathLength: 1, opacity: 1 }
          : { pathLength: reduceMotion ? 1 : 0, opacity: 0 }
      }
      transition={
        visible
          ? {
              pathLength: { duration: reduceMotion ? 0 : 0.2, ease: EASE.out },
              opacity: { duration: reduceMotion ? DURATION.fast : 0.05 },
            }
          : { duration: 0.1, ease: EASE.out }
      }
    />
  )
}

/**
 * Checkbox renders the Radix primitive directly rather than wrapping the
 * shadcn one, so the indicator can stay mounted and animate out as well as in.
 * The shadcn base stays untouched and can be regenerated from upstream.
 *
 * The checked state is mirrored here (controlled or not) because Motion needs
 * it in JS to drive the check mark.
 */
function Checkbox({
  ref,
  className,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & { ref?: React.RefObject<React.ElementRef<typeof CheckboxPrimitive.Root> | null> }) {
  const [checked, setChecked] = useControllableState<CheckedState>(checkedProp, defaultChecked ?? false, onCheckedChange)
  const reduceMotion = Boolean(useReducedMotion())

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot="checkbox"
      checked={checked}
      onCheckedChange={setChecked}
      className={cn(
        'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        // Fill fades in as the check draws; a small press-in confirms the click.
        'transition-[background-color,border-color,box-shadow,transform] duration-[var(--duration-fast)] ease-out active:scale-[0.92] disabled:active:scale-100',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        forceMount
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3.5"
        >
          <IndicatorMark d={CHECK_PATH} visible={checked === true} reduceMotion={reduceMotion} />
          <IndicatorMark d={DASH_PATH} visible={checked === 'indeterminate'} reduceMotion={reduceMotion} />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

Checkbox.displayName = 'Checkbox'

export { Checkbox }
