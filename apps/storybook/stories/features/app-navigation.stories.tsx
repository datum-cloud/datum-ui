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

const meta: Meta<typeof AppNavigation> = {
  title: 'Features/AppNavigation',
  component: AppNavigation,
  argTypes: {
    title: { control: 'text' },
    currentPath: {
      control: 'select',
      options: [
        '/',
        '/dashboard',
        '/users/all',
        '/users/invitations',
        '/users/roles',
        '/documents',
        '/settings/general',
        '/settings/security',
        '/settings/billing',
      ],
    },
    collapsible: {
      control: 'inline-radio',
      options: ['offcanvas', 'icon', 'none'],
    },
    loading: { control: 'boolean' },
    closeOnNavigation: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    itemClassName: { control: 'text' },
    activeItemClassName: {
      control: 'text',
      description:
        'Class applied only to the active nav item button. Try e.g. `font-bold text-primary` or `font-bold text-primary border-l-2 border-primary rounded-l-none`.',
    },
  },
  args: {
    navItems,
    title: 'My App',
    currentPath: '/dashboard',
    collapsible: 'icon',
    loading: false,
    closeOnNavigation: false,
    defaultOpen: true,
    itemClassName: '',
    activeItemClassName: '',
  },
  render: args => (
    <div className="h-[600px] w-full">
      <SidebarProvider defaultOpen={args.defaultOpen}>
        <AppNavigation {...args} />
        <SidebarInset>
          <div className="flex h-full items-center justify-center p-6">
            <p className="text-muted-foreground text-sm">Main content area</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof AppNavigation>

export const Default: Story = {}
