'use client'

import { ArrowDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

/** Floating chevron above the composer; jumps to the latest message. */
export function ScrollToBottomButton({ show, onClick }: { show: boolean, onClick: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          onClick={onClick}
          aria-label="Scroll to bottom"
          className="ring-border bg-card text-muted-foreground hover:text-foreground absolute -top-10 left-1/2 z-10 -translate-x-1/2 rounded-full p-1.5 ring-1 transition-colors"
        >
          <ArrowDown className="size-3.5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
