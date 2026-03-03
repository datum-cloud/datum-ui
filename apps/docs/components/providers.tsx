'use client'

import type { ReactNode } from 'react'

import { DatumProvider } from '@datum-cloud/datum-ui'

export function Providers({ children }: { children: ReactNode }) {
  return <DatumProvider>{children}</DatumProvider>
}
