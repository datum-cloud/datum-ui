import type { NavItem } from './nav-menu'
import { useEffect } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '../../base/sidebar/sidebar'
import { NavMenu } from './nav-menu'

export function AppNavigation({
  navItems,
  title,
  closeOnNavigation,
  defaultOpen,
  currentPath,
  linkComponent,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  navItems: NavItem[]
  title?: string | React.ReactNode
  closeOnNavigation?: boolean
  /** Controls sidebar open state — when false, sidebar closes on mount */
  defaultOpen?: boolean
  /** Current URL pathname — passed through to NavMenu */
  currentPath: string
  /** Link component — passed through to NavMenu (defaults to native `<a>`) */
  linkComponent?: React.ElementType
}) {
  const { setOpen } = useSidebar()

  useEffect(() => {
    if (defaultOpen === false) {
      setOpen(false)
    }
  }, [defaultOpen, setOpen])

  return (
    <Sidebar collapsible={props.collapsible ?? 'offcanvas'} {...props}>
      <SidebarContent className="gap-0">
        {title && <SidebarHeader className="px-4 pt-4 pb-0">{title}</SidebarHeader>}

        {navItems.length > 0 && (
          <NavMenu
            className="h-fit py-2"
            items={navItems}
            currentPath={currentPath}
            linkComponent={linkComponent}
            closeOnNavigation={closeOnNavigation}
          />
        )}

        {props.collapsible !== 'none' && (
          <SidebarFooter className="mt-auto p-2">
            <SidebarTrigger />
          </SidebarFooter>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
