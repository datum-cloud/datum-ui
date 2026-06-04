import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@datum-cloud/datum-ui/sidebar'
import {
  Home,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react'

const meta: Meta = {
  title: 'Features/Sidebar',
  component: Sidebar,
  parameters: {
    docs: {
      description: {
        component:
          'Base sidebar layout primitives for building custom navigation sidebars.\n\n'
          + 'The Sidebar system provides composable layout primitives for building fully custom '
          + 'navigation sidebars. It handles collapsible states, responsive mobile behavior (via '
          + 'Sheet), keyboard shortcuts, and hover-to-expand — giving you complete control over '
          + 'structure and content. Wrap everything in `SidebarProvider` which manages open/close '
          + 'state and passes context to all child components.',
      },
    },
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Basic sidebar layout with `SidebarProvider`, a `Sidebar` with menu items, and a '
          + '`SidebarInset` for the main content area. The trigger button toggles the sidebar open/closed.',
      },
    },
  },
  render: () => (
    <div className="flex h-[500px] w-full overflow-hidden">
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="Home">
                      <Home />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Dashboard">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Users">
                      <Users />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <Settings />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="text-sm font-medium">Main content</span>
          </header>
          <div className="p-4 text-sm text-muted-foreground">
            Resize or toggle the sidebar with the trigger button or Cmd+B / Ctrl+B.
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
}

export const WithHeaderFooterGroups: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates `SidebarHeader`, `SidebarFooter`, and `SidebarGroup` with a `SidebarGroupLabel` '
          + 'to organise navigation into labelled sections.',
      },
    },
  },
  render: () => (
    <div className="flex h-[500px] w-full overflow-hidden">
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarHeader className="px-4 py-3">
            <span className="text-sm font-semibold">Acme Inc</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="Home">
                      <Home />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Dashboard">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Users">
                      <Users />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="text-sm font-medium">Main content</span>
          </header>
          <div className="p-4 text-sm text-muted-foreground">
            The sidebar has a header, labelled groups, and a sticky footer.
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
}

export const CollapsedByDefault: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `defaultOpen={false}` on `SidebarProvider` to start with the sidebar collapsed. '
          + 'With `collapsible="icon"` on `Sidebar`, only icons remain visible in the collapsed state.',
      },
    },
  },
  render: () => (
    <div className="flex h-[500px] w-full overflow-hidden">
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Home">
                      <Home />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Dashboard">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <Settings />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="text-sm font-medium">Starts collapsed — click the trigger to expand</span>
          </header>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
}
