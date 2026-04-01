import type { ReactNode } from 'react'
import { FormAdapterProvider } from '../../adapter-context'
import { conformAdapter } from './conform-adapter'

export interface ConformAdapterProps {
  children: ReactNode
}

/**
 * Wrap your application with this provider to use Conform.js as the form backend.
 *
 * @example
 * ```tsx
 * import { ConformAdapter } from '@datum-cloud/datum-ui/form/adapters/conform'
 *
 * function App() {
 *   return (
 *     <ConformAdapter>
 *       <MyApp />
 *     </ConformAdapter>
 *   )
 * }
 * ```
 */
export function ConformAdapter({ children }: ConformAdapterProps) {
  return (
    <FormAdapterProvider adapter={conformAdapter}>
      {children}
    </FormAdapterProvider>
  )
}
