import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { Button } from '@repo/ui/button'
import { Logo } from '@repo/ui/logo'
import { headerStyles } from './header.styles'
import Avatar from '@/components/avatar'
import Alerts from '@repo/ui/alerts'

export default function Header() {
  const { data: sessionData } = useSession()
  const { header, nav, logoWrapper, mobileSidebar, userNav } = headerStyles()
  return (
    <div className={header()}>
      <nav className={nav()}>
        <Link href={'/'} className={logoWrapper()}>
          <Logo asIcon width={30} theme="blackberryLight" />
        </Link>
        <div className={mobileSidebar()}>
          <>MobileSidebar</>
        </div>

        <div className={userNav()}>
          <Alerts />
          <Avatar />
        </div>
      </nav>
    </div>
  )
}
