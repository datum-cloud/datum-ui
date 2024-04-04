'use client'

import { X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@repo/ui/button'
import { DATUM_WEBSITE_URL } from '../../../constants'
import { authStyles } from './auth.styles'

export interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname()
  const pageVariant = pathname.replace(/^./, '')

  const { base, bg, bgImage, closeButton, closeButtonIcon, content } =
    authStyles()

  return (
    <div className={base()}>
      <div className={content()}>
        <Button>test</Button>
        {children}
      </div>
      <div className={bg()}>
        <Image
          src={`/backgrounds/auth/${pageVariant}-bg.png`}
          priority
          fill
          className={bgImage()}
          alt=""
        />
      </div>
      <div className={closeButton()}>
        <Link href={DATUM_WEBSITE_URL}>
          <X className={closeButtonIcon()} />
        </Link>
      </div>
    </div>
  )
}
