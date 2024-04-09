'use client'

import { X } from 'lucide-react'
import Link from 'next/link'
import { DATUM_WEBSITE_URL } from '../../../constants'
import { authStyles } from './auth.styles'

export interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { base, closeButton, closeButtonIcon } = authStyles()

  return (
    <div className={base()}>
      {children}
      <div className={closeButton()}>
        <Link href={DATUM_WEBSITE_URL}>
          <X className={closeButtonIcon()} />
        </Link>
      </div>
    </div>
  )
}
