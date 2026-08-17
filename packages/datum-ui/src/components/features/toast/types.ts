import type { HeadlessToastVariant } from './headless-toast'

export interface Toast {
  id: string
  title?: string
  description?: string
  /**
   * Derived from `HeadlessToastVariant` so the exported contract cannot drift
   * from the runtime toast API (see `toast.ts` / `headless-toast.tsx`).
   */
  type: HeadlessToastVariant
}
