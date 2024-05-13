'use client'

import { Provider as UrqlProvider } from 'urql'
import { createClient } from '@/lib/urql'

interface ProvidersProps {
  children: any
}

const Providers = ({ children }: ProvidersProps) => {
  const client = createClient()

  return <UrqlProvider value={client}>{children}</UrqlProvider>
}

export default Providers
