import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@datum-cloud/datum-ui/card'

/**
 * Stat Card is a composition pattern — there is no dedicated StatCard component.
 * Use the Card primitives (Card, CardHeader, CardContent, CardTitle, CardDescription)
 * to build stat displays that match your layout needs.
 */
const meta: Meta = {
  title: 'Base/StatCard',
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          'Display key metrics and statistics using Card composition components.\n\n'
          + 'Stat Card is a composition pattern using the `Card`, `CardHeader`, `CardContent`, '
          + '`CardTitle`, and `CardDescription` components to display key metrics. There is no '
          + 'dedicated `StatCard` component — instead, compose the existing Card primitives to '
          + 'build stat displays that match your layout needs.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic usage of the Card primitives to display a single stat metric with a label, value, and trend note.',
      },
    },
  },
  render: () => (
    <Card className="w-64">
      <CardHeader>
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle className="text-2xl font-bold">$45,231.89</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
    </Card>
  ),
}

export const StatCardGrid: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Arrange multiple stat cards in a responsive grid using CSS grid utilities.',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-bold">2,350</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">+180 this week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Active Sessions</CardDescription>
          <CardTitle className="text-2xl font-bold">573</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">+12% from yesterday</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Error Rate</CardDescription>
          <CardTitle className="text-2xl font-bold">0.4%</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">-0.1% from last hour</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const CompactStatCard: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use minimal padding for dense dashboards by overriding spacing via className.',
      },
    },
  },
  render: () => (
    <Card className="w-48 py-3">
      <CardHeader className="px-4">
        <CardDescription className="text-xs">CPU Usage</CardDescription>
        <CardTitle className="text-xl font-bold">42%</CardTitle>
      </CardHeader>
    </Card>
  ),
}
