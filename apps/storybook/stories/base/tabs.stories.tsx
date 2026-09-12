import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Tabs, TabsContent, TabsLinkTrigger, TabsList, TabsTrigger } from '@datum-cloud/datum-ui/tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Base/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component:
          'Organize content into switchable panels with a tabbed navigation bar.\n\n'
          + 'Tabs let users switch between related groups of content without leaving the page. '
          + 'The component wraps Radix UI Tabs with Datum design tokens and is composed of `Tabs` (root), '
          + '`TabsList`, `TabsTrigger`, and `TabsContent`. Supports both controlled (`value` + `onValueChange`) '
          + 'and uncontrolled (`defaultValue`) usage.',
      },
    },
  },
  argTypes: {
    defaultValue: { control: 'text' },
  },
  args: {
    defaultValue: 'overview',
  },
}

export default meta

type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic tabs with three panels. The active tab is set via `defaultValue`.',
      },
    },
  },
  render: args => (
    <Tabs {...args}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="rounded-md border p-4">
          <p className="text-muted-foreground text-sm">Overview content goes here.</p>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="rounded-md border p-4">
          <p className="text-muted-foreground text-sm">Settings content goes here.</p>
        </div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="rounded-md border p-4">
          <p className="text-muted-foreground text-sm">Analytics content goes here.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}

export const Line: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`variant="line"` on `TabsList` renders underline page tabs: start-aligned, no pill background, '
          + 'and a sliding indicator under the active tab. The baseline rule is drawn by the surrounding layout '
          + 'so it can run full-bleed. Combine with `TabsLinkTrigger` for route-driven sub-navigation.',
      },
    },
  },
  render: () => (
    <Tabs defaultValue="overview" className="w-[480px]">
      <div className="border-border border-b">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
      </div>
      {['overview', 'configuration', 'metrics', 'logs', 'activity'].map(tab => (
        <TabsContent key={tab} value={tab}>
          <p className="text-muted-foreground pt-4 text-sm capitalize">
            {tab}
            {' '}
            content goes here.
          </p>
        </TabsContent>
      ))}
    </Tabs>
  ),
}

export const LineWithLinks: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Route-driven tabs: pass the current path as the controlled `value` and render each tab with '
          + '`TabsLinkTrigger`. Swap `linkComponent` for your router\'s Link.',
      },
    },
  },
  render: () => (
    <Tabs value="/alb/demo/overview" className="w-[480px]">
      <div className="border-border border-b">
        <TabsList variant="line">
          <TabsLinkTrigger value="/alb/demo/overview" href="#overview">Overview</TabsLinkTrigger>
          <TabsLinkTrigger value="/alb/demo/configuration" href="#configuration">Configuration</TabsLinkTrigger>
          <TabsLinkTrigger value="/alb/demo/metrics" href="#metrics">Metrics</TabsLinkTrigger>
        </TabsList>
      </div>
    </Tabs>
  ),
}

export const DisabledTab: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set `disabled` on a `TabsTrigger` to prevent selection of that tab.',
      },
    },
  },
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="billing" disabled>Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="pt-4 text-sm text-muted-foreground">Manage your account settings.</p>
      </TabsContent>
      <TabsContent value="security">
        <p className="pt-4 text-sm text-muted-foreground">Update your password.</p>
      </TabsContent>
    </Tabs>
  ),
}
