import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@datum-cloud/datum-ui/tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Base/Tabs',
  component: Tabs,
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">
            Overview content goes here. This is the first tab panel.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">
            Settings content goes here. Manage your preferences in this panel.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">
            Analytics content goes here. View metrics and insights.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}

export const WithDefaultValue: Story = {
  render: () => (
    <Tabs defaultValue="settings">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">
            General settings panel. This is not the default tab.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">
            This tab is selected by default via the defaultValue prop.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="notifications">
        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">
            Notification preferences panel.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}
