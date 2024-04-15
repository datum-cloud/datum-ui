import Link from 'next/link'
import { Logo } from '@repo/ui/logo'
import { headerStyles } from './header.styles'
import Alerts from '@repo/ui/alerts'
import { UserMenu } from '@/components/shared/user-menu/user-menu'
import { useGetAllOrganizationsQuery } from '../../../../../../codegen/src/schema'

export default function Header() {
  const { header, nav, logoWrapper, mobileSidebar, userNav } = headerStyles()
  const [allOrgs] = useGetAllOrganizationsQuery()
  console.log(allOrgs.data)
  return (
    <>
      <div className={header()}>
        <nav className={nav()}>
          <Link href={'/'} className={logoWrapper()}>
            <Logo width={115} theme="dark" />
          </Link>

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
