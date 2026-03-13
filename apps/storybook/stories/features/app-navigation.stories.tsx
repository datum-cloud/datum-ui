import type { NavItem } from '@datum-cloud/datum-ui/app-navigation'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  AppNavigation,
  SidebarInset,
  SidebarProvider,
} from '@datum-cloud/datum-ui/app-navigation'
import {
  FileText,
  Home,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react'

const meta: Meta = {
  title: 'Features/AppNavigation',
}

export default meta

type Story = StoryObj

const navItems: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    type: 'link',
    icon: Home,
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    type: 'link',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/users',
    type: 'collapsible',
    icon: Users,
    children: [
      { title: 'All Users', href: '/users/all', type: 'link' },
      { title: 'Invitations', href: '/users/invitations', type: 'link' },
      { title: 'Roles', href: '/users/roles', type: 'link' },
    ],
  },
  {
    title: 'Documents',
    href: '/documents',
    type: 'link',
    icon: FileText,
    showSeparatorAbove: true,
  },
  {
    title: 'Settings',
    href: '/settings',
    type: 'collapsible',
    icon: Settings,
    children: [
      { title: 'General', href: '/settings/general', type: 'link' },
      { title: 'Security', href: '/settings/security', type: 'link' },
      { title: 'Billing', href: '/settings/billing', type: 'link' },
    ],
  },
]

export const Default: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <SidebarProvider defaultOpen>
        <AppNavigation
          navItems={navItems}
          title="My App"
          currentPath="/dashboard"
          collapsible="icon"
        />
        <SidebarInset>
          <div className="flex h-full items-center justify-center p-6">
            <p className="text-muted-foreground text-sm">Main content area</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
}

export const Collapsed: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <SidebarProvider defaultOpen={false}>
        <AppNavigation
          navItems={navItems}
          title="My App"
          currentPath="/dashboard"
          collapsible="icon"
        />
        <SidebarInset>
          <div className="flex h-full items-center justify-center p-6">
            <p className="text-muted-foreground text-sm">
              Sidebar is collapsed. Hover over it or click the toggle.
            </p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
}

export const WithGroups: Story = {
  render: () => {
    const groupedItems: NavItem[] = [
      {
        title: 'Platform',
        href: null,
        type: 'group',
        children: [
          { title: 'Dashboard', href: '/dashboard', type: 'link', icon: LayoutDashboard },
          { title: 'Users', href: '/users', type: 'link', icon: Users },
        ],
      },
      {
        title: 'Resources',
        href: null,
        type: 'group',
        children: [
          { title: 'Documents', href: '/documents', type: 'link', icon: FileText },
          { title: 'Settings', href: '/settings', type: 'link', icon: Settings },
        ],
      },
    ]

    return (
      <div className="h-[600px] w-full">
        <SidebarProvider defaultOpen>
          <AppNavigation
            navItems={groupedItems}
            title="Grouped Nav"
            currentPath="/dashboard"
            collapsible="icon"
          />
          <SidebarInset>
            <div className="flex h-full items-center justify-center p-6">
              <p className="text-muted-foreground text-sm">Sidebar with grouped navigation</p>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
  },
}
