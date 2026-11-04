import type { LucideProps } from 'lucide-react'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { DURATION, EASE } from '../../../utils/motion'

const TRANSITION = { duration: DURATION.fast, ease: EASE.out } as const

const SHOWN = { opacity: 1, scale: 1, filter: 'blur(0px)' }
const HIDDEN = { opacity: 0, scale: 0.5, filter: 'blur(2px)' }
const HIDDEN_REDUCED = { opacity: 0, scale: 1, filter: 'blur(0px)' }

/**
 * Copy glyph that turns into a check once the copy has happened, and back again
 * when `copied` resets. The two glyphs are stacked and cross-fade with a scale
 * and a light blur, so the swap reads as one icon changing rather than two
 * swapping places. Under reduced motion it only fades.
 *
 * Decorative: the owning button carries the accessible label.
 */
export function CopyStateIcon({ copied, ...iconProps }: LucideProps & { copied: boolean }) {
  const reduceMotion = Boolean(useReducedMotion())
  const hidden = reduceMotion ? HIDDEN_REDUCED : HIDDEN

  return (
    <span aria-hidden data-slot="copy-state-icon" data-copied={copied} className="inline-grid shrink-0 place-items-center">
      <motion.span
        className="flex [grid-area:1/1]"
        initial={false}
        animate={copied ? hidden : SHOWN}
        transition={TRANSITION}
      >
        <CopyIcon aria-hidden {...iconProps} />
      </motion.span>
      <motion.span
        className="flex [grid-area:1/1]"
        initial={false}
        animate={copied ? SHOWN : hidden}
        transition={TRANSITION}
      >
        <CheckIcon aria-hidden {...iconProps} />
      </motion.span>
    </span>
  )
}
