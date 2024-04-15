import Link from 'next/link'
import { headerStyles } from './header.styles'
import Alerts from '@repo/ui/alerts'
import { UserMenu } from '@/components/shared/user-menu/user-menu'
import { WorkspaceSelector } from '../workspace-selector/workspace-selector'

export default function Header() {
  const { header, nav, mobileSidebar, userNav } = headerStyles()
  return (
    <>
      <div className={header()}>
        <nav className={nav()}>
          <WorkspaceSelector />

          <div className={mobileSidebar()}>
            <>MobileSidebar</>
          </div>

          <div className={userNav()}>
            <Link href="#">Feedback</Link>
            <Link href="#">Changelog</Link>
            <Link href="#">Docs</Link>
            <Alerts />
            <UserMenu />
          </div>
        </nav>
      </div>
    </>
  )
}
