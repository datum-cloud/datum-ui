import type { Meta, StoryObj } from "@storybook/react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  Label,
} from "@datum-cloud/datum-ui";

const meta: Meta<typeof Tabs> = {
  component: Tabs,
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[480px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="deployments">Deployments</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="flex flex-col gap-2 pt-4 text-sm text-muted-foreground">
          <p>
            Your service is running 3 replicas in us-east-1 with a 99.98%
            uptime over the last 30 days.
          </p>
          <p>
            The last deployment was triggered 2 hours ago and completed
            successfully with no downtime.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="deployments">
        <div className="flex flex-col gap-3 pt-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs">v2.4.1</span>
            <span className="text-green-600 text-xs">Deployed</span>
            <span className="text-muted-foreground text-xs">2 hours ago</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs">v2.4.0</span>
            <span className="text-muted-foreground text-xs">Superseded</span>
            <span className="text-muted-foreground text-xs">1 day ago</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs">v2.3.9</span>
            <span className="text-muted-foreground text-xs">Superseded</span>
            <span className="text-muted-foreground text-xs">4 days ago</span>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="logs">
        <div className="pt-4 font-mono text-xs text-muted-foreground bg-muted rounded-md p-3 space-y-1">
          <p>2026-02-27T10:14:02Z INFO  Service started on :8080</p>
          <p>2026-02-27T10:14:03Z INFO  Health check passed</p>
          <p>2026-02-27T10:14:05Z INFO  Connected to database</p>
          <p>2026-02-27T10:15:12Z DEBUG Handling GET /api/v1/resources</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const Realistic: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[480px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="display-name">Display Name</Label>
            <Input id="display-name" placeholder="Sarah Lin" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="sarah@example.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="org">Organization</Label>
            <Input id="org" placeholder="Acme Corp" />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="security">
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" placeholder="••••••••" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" placeholder="••••••••" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" placeholder="••••••••" />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="notifications">
        <div className="flex flex-col gap-4 pt-4 text-sm">
          <p className="text-muted-foreground">
            Choose how you receive alerts for deployments, incidents, and quota
            warnings.
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notify-email">Notification Email</Label>
            <Input
              id="notify-email"
              type="email"
              placeholder="alerts@example.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
            <Input
              id="slack-webhook"
              placeholder="https://hooks.slack.com/services/..."
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
};
