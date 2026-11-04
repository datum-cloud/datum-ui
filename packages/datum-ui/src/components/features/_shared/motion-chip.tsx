import type { HTMLMotionProps } from 'motion/react'
import { motion, useReducedMotion } from 'motion/react'
import { DURATION, EASE } from '../../../utils/motion'
import { Badge } from '../../base/badge'

/** `Badge` as a Motion component, so chips can enter, exit and reflow. */
export const MotionBadge = motion.create(Badge)

const ENTER = { duration: DURATION.fast, ease: EASE.out } as const
const EXIT = { duration: 0.1, ease: EASE.out } as const
/** Neighbours slide into a removed chip's gap a touch slower than it fades. */
const REFLOW = { duration: 0.2, ease: EASE.out } as const

/**
 * Motion props for a chip in a wrapping list, for use with `MotionBadge`
 * inside `<AnimatePresence initial={false} mode="popLayout">`.
 *
 * A chip scales up slightly as it fades in, and fades out a little faster
 * when removed. `popLayout` takes the leaving chip out of flow straight away,
 * and `layout="position"` slides the chips after it into the gap rather than
 * snapping. The list needs `position: relative` for `popLayout` to place the
 * leaving chip. Under reduced motion chips only fade and nothing slides.
 */
export function useChipMotion(): Pick<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit' | 'transition' | 'layout'> {
  const reduceMotion = Boolean(useReducedMotion())
  const scale = reduceMotion ? 1 : 0.85

  return {
    initial: { opacity: 0, scale },
    animate: { opacity: 1, scale: 1, transition: ENTER },
    exit: { opacity: 0, scale, transition: EXIT },
    transition: { layout: REFLOW },
    layout: reduceMotion ? false : 'position',
  }
}
