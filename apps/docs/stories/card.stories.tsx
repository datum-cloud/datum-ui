import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from "@datum-cloud/datum-ui";

const meta: Meta<typeof Card> = {
  component: Card,
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription>
          A summary of your current deployment configuration and resource usage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This project is running 3 active services across 2 regions with a
          combined uptime of 99.98% over the last 30 days.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>API Gateway</CardTitle>
        <CardDescription>
          Manages inbound traffic for all microservices in your cluster.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Region</span>
            <span>us-east-1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="text-green-600">Healthy</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Replicas</span>
            <span>3 / 3</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Last updated 2 minutes ago
        </p>
      </CardFooter>
    </Card>
  ),
};

export const ProfileCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-lg font-semibold">
            SL
          </div>
          <div>
            <CardTitle>Sarah Lin</CardTitle>
            <CardDescription>Platform Engineer</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Manages infrastructure automation and CI/CD pipelines for the core
          platform team. Based in Seattle, WA.
        </p>
      </CardContent>
    </Card>
  ),
};

export const StatsCard: Story = {
  render: () => (
    <div className="flex gap-4">
      <Card className="w-48">
        <CardHeader>
          <CardDescription>Total Requests</CardDescription>
          <CardTitle className="text-3xl">1.4M</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            +12% from last week
          </p>
        </CardContent>
      </Card>
      <Card className="w-48">
        <CardHeader>
          <CardDescription>Error Rate</CardDescription>
          <CardTitle className="text-3xl">0.3%</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            -0.1% from last week
          </p>
        </CardContent>
      </Card>
      <Card className="w-48">
        <CardHeader>
          <CardDescription>Avg Latency</CardDescription>
          <CardTitle className="text-3xl">84ms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Within SLA target
          </p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Delete Namespace</CardTitle>
        <CardDescription>
          This will permanently remove the namespace and all associated
          resources. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Namespace: <span className="font-mono font-medium">production-us-east</span>
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button type="secondary" theme="outline">
          Cancel
        </Button>
        <Button type="danger">Delete Namespace</Button>
      </CardFooter>
    </Card>
  ),
};
