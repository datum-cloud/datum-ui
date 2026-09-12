import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Badge } from '@datum-cloud/datum-ui/badge'
import { Button } from '@datum-cloud/datum-ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@datum-cloud/datum-ui/card'

const meta: Meta<typeof Card> = {
  title: 'Base/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          'A container component for grouping related content with optional header, footer, and description sections.\n\n'
          + 'The Card component provides a styled container for grouping related content. It includes '
          + 'sub-components for structured layouts: `CardHeader`, `CardTitle`, `CardDescription`, '
          + '`CardAction`, `CardContent`, and `CardFooter`.\n\n'
          + '**Spacing.** The root publishes `--card-px` / `--card-py`; every slot reads them, so `size` '
          + 'changes the inset of the whole card at once. Rows you render inside a flush `CardContent` can '
          + 'use `px-(--card-px)` to line up with the header.\n\n'
          + '**Layouts.** Stacked (default) puts vertical padding and a gap on the root — the historical '
          + 'behaviour. `sectioned` removes both so each slot owns its inset and slots are separated by '
          + 'dividers (`CardHeader bordered`, `CardFooter bordered`). Use sectioned for headers above '
          + 'flush lists or tables, and for settings cards with a footer action bar.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    sectioned: { control: 'boolean' },
  },
  args: {
    size: 'md',
    sectioned: false,
  },
}

export default meta

type Story = StoryObj<typeof Card>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A card with header (title + description), content, and footer action buttons.',
      },
    },
  },
  render: args => (
    <Card className="w-[380px]" {...args}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description providing additional context.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          This is the main content area of the card. You can place any content here.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button type="secondary" theme="outline">Cancel</Button>
        <Button type="primary">Save Changes</Button>
      </CardFooter>
    </Card>
  ),
}

export const SimpleCard: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A card with content only, without a header or footer.',
      },
    },
  },
  render: () => (
    <Card className="w-[380px]">
      <CardContent>
        <p className="text-muted-foreground text-sm">
          A simple card with only content, no header or footer.
        </p>
      </CardContent>
    </Card>
  ),
}

export const CompactStat: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`size="sm"` tightens the inset and gap for dense dashboard tiles such as KPI / stat cards. '
          + 'Every slot follows the root, so nothing else needs overriding.',
      },
    },
  },
  render: () => (
    <div className="grid w-[640px] grid-cols-2 gap-4">
      {[
        { label: 'Requests', value: '9.00', unit: 'req/s', delta: '+4.2%' },
        { label: 'Error rate', value: '0.00', unit: '%', delta: '0 errors' },
      ].map(stat => (
        <Card key={stat.label} size="sm">
          <CardContent className="flex flex-col gap-2">
            <span className="text-muted-foreground text-xs font-medium">{stat.label}</span>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-semibold tabular-nums">
                {stat.value}
                <span className="text-muted-foreground ml-1 text-sm font-normal">{stat.unit}</span>
              </span>
              <Badge type="success" theme="light">{stat.delta}</Badge>
            </div>
            <div className="bg-muted h-8 rounded" aria-hidden />
          </CardContent>
        </Card>
      ))}
    </div>
  ),
}

export const WithAction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`CardAction` places a trailing control in the header, spanning the title and description rows. '
          + 'Use it for "Manage", "View all", or status badges.',
      },
    },
  },
  render: () => (
    <Card className="w-[480px]">
      <CardHeader>
        <CardTitle>Live traffic</CardTitle>
        <CardDescription>Requests per second · last 60 minutes</CardDescription>
        <CardAction>
          <Button type="secondary" theme="outline" size="xs">Manage</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="bg-muted h-40 rounded-md" aria-hidden />
      </CardContent>
    </Card>
  ),
}

const hostnames = [
  { host: 'app.example.com', kind: 'Custom hostname', status: 'Verified', type: 'success' as const },
  { host: 'staging.example.com', kind: 'Custom hostname', status: 'Pending DNS', type: 'warning' as const },
  { host: 'abc123.datumproxy.net', kind: 'Default hostname', status: 'System-managed', type: 'muted' as const },
]

export const SectionedList: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A `sectioned` card: the header owns its inset and draws a divider, and `CardContent padding="x-none"` '
          + 'lets the rows run edge to edge. Rows use `px-(--card-px)` so their text lines up with the title.',
      },
    },
  },
  render: () => (
    <Card sectioned className="w-[480px]">
      <CardHeader size="sm" bordered>
        <CardTitle className="text-sm">Endpoints</CardTitle>
        <CardAction>
          <Button type="secondary" theme="borderless" size="xs">Manage</Button>
        </CardAction>
      </CardHeader>
      <CardContent padding="x-none" className="py-0">
        <ul className="divide-border divide-y">
          {hostnames.map(item => (
            <li key={item.host} className="flex flex-col gap-1.5 px-(--card-px) py-3">
              <span className="text-muted-foreground text-2xs font-medium tracking-wide uppercase">
                {item.kind}
              </span>
              <span className="font-mono text-sm">{item.host}</span>
              <Badge type={item.type} theme="light" className="w-fit">{item.status}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  ),
}

const requests = [
  { status: 200, method: 'GET', path: '/api/tracks', ms: 42 },
  { status: 403, method: 'GET', path: '/admin/login', ms: 6 },
  { status: 201, method: 'POST', path: '/api/checkout', ms: 156 },
  { status: 200, method: 'GET', path: '/health', ms: 28 },
]

export const SectionedTable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`CardContent padding="none"` for a table that should touch every edge below the header. '
          + 'The header keeps its inset; the card keeps its rounded corners via `overflow-hidden`.',
      },
    },
  },
  render: () => (
    <Card sectioned className="w-[480px] overflow-hidden">
      <CardHeader size="sm" bordered>
        <CardTitle className="text-sm">Live requests</CardTitle>
        <CardAction>
          <Button type="secondary" theme="link" size="link" className="text-xs">View all</Button>
        </CardAction>
      </CardHeader>
      <CardContent padding="none">
        <table className="w-full text-sm">
          <tbody className="divide-border divide-y">
            {requests.map(row => (
              <tr key={row.path} className="hover:bg-muted/40">
                <td className="py-2.5 pl-(--card-px) font-mono text-xs">{row.status}</td>
                <td className="text-muted-foreground py-2.5 text-xs">{row.method}</td>
                <td className="w-full py-2.5 font-mono text-xs">{row.path}</td>
                <td className="text-muted-foreground py-2.5 pr-(--card-px) text-right text-xs tabular-nums">
                  {row.ms}
                  ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  ),
}

export const SectionedWithFooter: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Settings-style card: bordered header, definition rows, and a `CardFooter bordered` action bar. '
          + 'This is the shape a sticky save/cancel bar slots into.',
      },
    },
  },
  render: () => (
    <Card sectioned className="w-[520px]">
      <CardHeader bordered>
        <CardTitle>TLS &amp; Certificates</CardTitle>
        <CardAction>
          <Badge type="muted" theme="light">Editing</Badge>
        </CardAction>
      </CardHeader>
      <CardContent padding="x-none" className="py-0">
        <dl className="divide-border divide-y">
          {[
            ['Certificate mode', 'Automatic'],
            ['Minimum TLS version', 'TLS 1.2'],
            ['Force HTTPS', 'On'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between px-(--card-px) py-3">
              <dt className="text-sm font-medium">{label}</dt>
              <dd className="text-muted-foreground text-sm">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
      <CardFooter bordered className="bg-muted/40 flex items-center justify-between">
        <span className="text-muted-foreground text-xs">2 unsaved changes</span>
        <div className="flex gap-2">
          <Button type="secondary" theme="outline" size="small">Cancel</Button>
          <Button type="primary" size="small">Save changes</Button>
        </div>
      </CardFooter>
    </Card>
  ),
}

export const FullExample: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A complete card showcasing all sub-components: header, title, description, content, and footer.',
      },
    },
  },
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Configure how you receive notifications.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Email notifications</span>
            <span className="text-muted-foreground">Enabled</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Push notifications</span>
            <span className="text-muted-foreground">Disabled</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="primary" theme="solid" block>Update Preferences</Button>
      </CardFooter>
    </Card>
  ),
}
