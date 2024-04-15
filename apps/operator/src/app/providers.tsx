'use client'

import { Provider as UrqlProvider } from 'urql'
import { createClient } from '@/lib/urql'
import { useSession } from 'next-auth/react'

interface ProvidersProps {
  children: any
}

const Providers = ({ children }: ProvidersProps) => {
  const { data: session } = useSession()
  const client = createClient(session)

  return <UrqlProvider value={client}>{children}</UrqlProvider>
}

export default Providers
