import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { Button } from '@repo/ui/button'
import { Logo } from '@repo/ui/logo'
import { headerStyles } from './header.styles'

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
          {sessionData?.user ? (
            <>user nav</>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                void signIn()
              }}
            >
              Sign In
            </Button>
          )}
        </div>
      </nav>
    </div>
  )
}
