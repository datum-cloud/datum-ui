import { createContext, use } from 'react'

/**
 * Signals that children are rendered inside a MobileSheet. Responsive
 * primitives (ResponsivePopover, ResponsiveDropdown) read this context
 * and skip their own sheet branch when it is true, preventing
 * sheet-in-sheet stacking on mobile.
 *
 * MobileSheet provides this automatically. Downstream consumers that
 * build their own sheet shells can wrap sections in the provider
 * manually to opt in to the same suppression.
 */
export const InSheetContext = createContext<boolean>(false)

export function useInSheet(): boolean {
  return use(InSheetContext)
}
