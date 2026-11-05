import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { motion, useReducedMotion } from 'motion/react'
import * as React from 'react'
import { DURATION, EASE } from '../../../utils/motion'
import { useControllableState } from '../hooks'

/**
 * Open state, mirrored from the root so `CollapsibleContent` can drive Motion.
 * `null` means the content sits under a bare Radix root rather than ours, and
 * falls back to Radix's own mount/unmount with no animation.
 */
const CollapsibleOpenContext = React.createContext<boolean | null>(null)

function Collapsible({
  ref,
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root> & { ref?: React.RefObject<React.ElementRef<typeof CollapsiblePrimitive.Root> | null> }) {
  const [open, setOpen] = useControllableState(openProp, defaultOpen ?? false, onOpenChange)

  return (
    <CollapsibleOpenContext value={open}>
      <CollapsiblePrimitive.Root
        ref={ref}
        data-slot="collapsible"
        open={open}
        onOpenChange={setOpen}
        {...props}
      />
    </CollapsibleOpenContext>
  )
}

Collapsible.displayName = 'Collapsible'

const CollapsibleTrigger = CollapsiblePrimitive.Trigger

const OPEN = {
  height: { duration: DURATION.medium, ease: EASE.out },
  opacity: { duration: DURATION.medium, ease: EASE.out },
} as const
const CLOSE = {
  height: { duration: 0.2, ease: EASE.out },
  // Content fades ahead of the height so it never looks clipped mid-collapse.
  opacity: { duration: 0.12, ease: EASE.out },
} as const

/**
 * Collapsible content that animates its height and opacity with Motion.
 *
 * The node stays mounted. Radix would unmount it on close and drive the height
 * from a measured CSS variable, which restarts from zero if the user toggles
 * mid-animation and can measure 0px inside scroll containers. Motion animates
 * to and from `height: auto` instead and retargets smoothly when interrupted.
 * While closed the content is `inert`, so it is out of the tab order and the
 * accessibility tree just as an unmounted node would be.
 *
 * Under reduced motion the height changes instantly and only the fade remains.
 */
function CollapsibleContent({
  ref,
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content> & { ref?: React.RefObject<React.ElementRef<typeof CollapsiblePrimitive.Content> | null> }) {
  const open = React.use(CollapsibleOpenContext)
  const reduceMotion = Boolean(useReducedMotion())
  // Once the close has finished the node is `hidden`, so a closed collapsible
  // takes no space in a `gap`/`space-y` parent, as an unmounted one would not.
  // Opening clears it in the same render, before Motion measures the height.
  const [settledClosed, setSettledClosed] = React.useState(open === false)
  if (open && settledClosed)
    setSettledClosed(false)

  if (open === null || props.asChild) {
    return (
      <CollapsiblePrimitive.Content ref={ref} data-slot="collapsible-content" className={className} {...props}>
        {children}
      </CollapsiblePrimitive.Content>
    )
  }

  const transition = open ? OPEN : CLOSE

  return (
    <CollapsiblePrimitive.Content ref={ref} forceMount hidden={!open && settledClosed} asChild {...props}>
      <motion.div
        data-slot="collapsible-content"
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={reduceMotion ? { ...transition, height: { duration: 0 } } : transition}
        onAnimationComplete={() => {
          if (!open)
            setSettledClosed(true)
        }}
        inert={!open}
        // Clip only the outer box so content padding and margins animate with it.
        style={{ overflow: 'hidden' }}
      >
        <div className={className}>{children}</div>
      </motion.div>
    </CollapsiblePrimitive.Content>
  )
}

CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
