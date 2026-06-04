import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@datum-cloud/datum-ui/tabs'

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
