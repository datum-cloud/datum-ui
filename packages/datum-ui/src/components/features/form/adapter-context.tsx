import type { FormAdapter } from './adapter-types'
import * as React from 'react'

const AdapterContext = React.createContext<FormAdapter | null>(null)

/**
 * Read the current form adapter from context.
 * Throws with a helpful error if no adapter is found.
 */
export function useAdapter(): FormAdapter {
  const adapter = React.use(AdapterContext)

  if (!adapter) {
    throw new Error(
      'No form adapter found. Wrap your application with an adapter provider:\n\n'
      + '  import { ConformAdapter } from \'@datum-cloud/datum-ui/form/adapters/conform\'\n'
      + '  // or\n'
      + '  import { RHFAdapter } from \'@datum-cloud/datum-ui/form/adapters/rhf\'\n\n'
      + '  <ConformAdapter>\n'
      + '    <App />\n'
      + '  </ConformAdapter>',
    )
  }

  return adapter
}

export interface FormAdapterProviderProps {
  adapter: FormAdapter
  children: React.ReactNode
}

/**
 * Internal provider used by adapter packages (ConformAdapter, RHFAdapter).
 * Consumers don't use this directly.
 */
export function FormAdapterProvider({ adapter, children }: FormAdapterProviderProps) {
  return <AdapterContext value={adapter}>{children}</AdapterContext>
}
