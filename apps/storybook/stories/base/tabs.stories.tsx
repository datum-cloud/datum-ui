import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@datum-cloud/datum-ui/tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Base/Tabs',
  component: Tabs,
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
