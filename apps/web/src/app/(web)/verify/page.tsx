import type { Metadata } from 'next/types'
import { Suspense } from 'react'

import { HomePage } from '@/components/pages/home/HomePage'

export const metadata: Metadata = {
  title: 'Datum - Verify your email',
}

export default async function NewsletterVerification() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage verification />
    </Suspense>
  )
}
