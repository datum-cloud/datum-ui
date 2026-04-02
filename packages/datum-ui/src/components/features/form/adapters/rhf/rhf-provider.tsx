import type { ReactNode } from 'react'
import { FormAdapterProvider } from '../../adapter-context'
import { rhfAdapter } from './rhf-adapter'

export interface RHFAdapterProps {
  children: ReactNode
}

/**
 * Wrap your application with this provider to use React Hook Form as the form backend.
 *
 * @example
 * ```tsx
 * import { RHFAdapter } from '@datum-cloud/datum-ui/form/adapters/rhf'
 *
 * function App() {
 *   return (
 *     <RHFAdapter>
 *       <MyApp />
 *     </RHFAdapter>
 *   )
 * }
 * ```
 */
export function RHFAdapter({ children }: RHFAdapterProps) {
  return (
    <FormAdapterProvider adapter={rhfAdapter}>
      {children}
    </FormAdapterProvider>
  )
}
