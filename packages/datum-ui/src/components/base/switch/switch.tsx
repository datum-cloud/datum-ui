import * as SwitchPrimitive from '@radix-ui/react-switch'
import { CheckIcon, XIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { DURATION, EASE } from '../../../utils/motion'
import { useControllableState } from '../hooks'

/** Thumb diameter in px (`size-5`). */
const THUMB = 20
/** How far the thumb travels: the track's inner width (44 - 2px border) minus the thumb. */
const TRAVEL = 22
/** How much the thumb widens while pressed, toward the side it will move to. */
const STRETCH = 4

const THUMB_SPRING = { type: 'spring', visualDuration: 0.22, bounce: 0.15 } as const
const GLYPH_TRANSITION = { duration: DURATION.fast, ease: EASE.out } as const

/**
 * Switch renders the Radix primitive directly rather than wrapping the shadcn
 * one, because its state glyphs go inside the thumb. Building it here keeps the
 * shadcn base untouched, so that base can be regenerated from upstream without
 * losing anything of ours.
 *
 * Motion drives the thumb: it slides on a light spring, stretches while the
 * pointer is held down (so the press registers before the release toggles it),
 * and the on/off glyphs cross-fade. Under reduced motion the thumb moves
 * instantly and only the glyphs fade.
 */
function Switch({
  ref,
  className,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & { ref?: React.RefObject<React.ElementRef<typeof SwitchPrimitive.Root> | null> }) {
  const [checked, setChecked] = useControllableState(checkedProp, defaultChecked ?? false, onCheckedChange)
  const [pressed, setPressed] = React.useState(false)
  const reduceMotion = Boolean(useReducedMotion())

  const stretch = pressed && !reduceMotion && !props.disabled ? STRETCH : 0
  const x = checked ? TRAVEL - stretch : 0

  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="switch"
      checked={checked}
      onCheckedChange={setChecked}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (event.button === 0)
          setPressed(true)
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event)
        setPressed(false)
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        setPressed(false)
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event)
        setPressed(false)
      }}
      className={cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        // Explicit transition properties + motion tokens, rather than the
        // blanket `transition-all` the shadcn base uses.
        'transition-[background-color,border-color,box-shadow] duration-[var(--duration-fast)] ease-out',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb asChild>
        <motion.span
          data-slot="switch-thumb"
          initial={false}
          animate={{ x, width: THUMB + stretch }}
          transition={reduceMotion ? { duration: 0 } : THUMB_SPRING}
          className={cn(
            // The glyph colour mirrors the thumb's own background conditionals so
            // it stays legible in every combination. The dark checked thumb is
            // the one that inverts: it uses primary-foreground, which is dark.
            'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground text-muted-foreground dark:data-[state=unchecked]:text-background dark:data-[state=checked]:text-primary pointer-events-none relative flex h-5 items-center justify-center rounded-full ring-0',
          )}
        >
          {/* Decorative: state already reaches assistive tech through role="switch"
              and aria-checked. These exist so sighted users can read on/off from
              the glyph rather than from thumb position and colour alone. */}
          <motion.span
            aria-hidden
            className="absolute flex"
            initial={false}
            animate={checked ? { opacity: 0, scale: reduceMotion ? 1 : 0.5 } : { opacity: 1, scale: 1 }}
            transition={GLYPH_TRANSITION}
          >
            <XIcon aria-hidden className="size-3" />
          </motion.span>
          <motion.span
            aria-hidden
            className="absolute flex"
            initial={false}
            animate={checked ? { opacity: 1, scale: 1 } : { opacity: 0, scale: reduceMotion ? 1 : 0.5 }}
            transition={GLYPH_TRANSITION}
          >
            <CheckIcon aria-hidden className="size-3" />
          </motion.span>
        </motion.span>
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

Switch.displayName = 'Switch'

export { Switch }
