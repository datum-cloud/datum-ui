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

const groupedNavItems: NavItem[] = [
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

const meta: Meta<typeof AppNavigation> = {
  title: 'Features/AppNavigation',
  component: AppNavigation,
  parameters: {
    docs: {
      description: {
        component:
          'A complete navigation sidebar with collapsible menus, route highlighting, and motion animations.\n\n'
          + '`AppNavigation` is a pre-composed sidebar built on top of the base Sidebar primitives. It adds '
          + 'declarative navigation via a `navItems` prop, automatic active-state detection based on `currentPath`, '
          + 'collapsible sub-menus (`type: \'collapsible\'`), labeled section groups (`type: \'group\'`), '
          + 'hover-to-expand behavior with motion animations, and a keyboard shortcut (Cmd+B / Ctrl+B) to toggle.\n\n'
          + '`AppNavigation` also re-exports all base sidebar primitives, so you can import everything from a single entry point.\n\n'
          + 'Requires the `motion` package.',
      },
    },
  },
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Basic usage with flat link items, a collapsible sub-menu, and a separator. '
          + 'The active item is highlighted based on `currentPath`. '
          + 'Use the Controls to change the path, collapse behavior, and open state.',
      },
    },
  },
}

export const WithNestedCollapsible: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Navigation items can have `children`, rendered as collapsible sub-menus when `type: \'collapsible\'` is set. '
          + 'The sub-menu for the active path is automatically expanded.',
      },
    },
  },
  args: {
    currentPath: '/users/all',
  },
}

export const WithGroups: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `type: \'group\'` to organize items under labeled sections. '
          + 'Group items have `href: null` and their `title` is rendered as a section heading.',
      },
    },
  },
  args: {
    navItems: groupedNavItems,
    currentPath: '/dashboard',
  },
}

export const CollapsedState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `defaultOpen` to `false` to start the sidebar collapsed. '
          + 'With `collapsible: \'icon\'`, icons remain visible in the collapsed state.',
      },
    },
  },
  args: {
    defaultOpen: false,
  },
}
