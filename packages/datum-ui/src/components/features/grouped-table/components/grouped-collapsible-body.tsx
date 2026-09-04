import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { EASE } from '../../../../utils/motion'

const OPEN_TRANSITION = { duration: 0.18, ease: EASE.out }
const INSTANT = { duration: 0 }

/**
 * Height animation for a group body. Do not use Radix CollapsibleContent:
 * it measures `--radix-collapsible-content-height` with getBoundingClientRect,
 * and later groups inside `overflow-x-auto` often measure as 0px.
 *
 * Keep this node mounted. AnimatePresence exit from `height: auto` has to
 * measure on the way out, which is the beat of delay after a click.
 * `initial={false}` skips the enter animation for groups that start open.
 *
 * Overflow stays hidden. The header/body divider is a 1px rule inside this
 * wrapper, not a row `border-t`, so it is not clipped.
 */
export function GroupedCollapsibleBody({
  open,
  reduceMotion,
  children,
}: {
  open: boolean
  reduceMotion: boolean
  children: ReactNode
}) {
  return (
    <motion.div
      data-slot="grouped-table-group-content"
      initial={false}
      animate={{ height: open ? 'auto' : 0 }}
      transition={reduceMotion ? INSTANT : OPEN_TRANSITION}
      className="overflow-hidden"
      inert={!open}
    >
      <div data-slot="grouped-table-group-rule" className="bg-border h-px" />
      {children}
    </motion.div>
  )
}
