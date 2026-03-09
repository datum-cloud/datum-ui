import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Badge } from '@datum-cloud/datum-ui/badge'

const meta: Meta<typeof Badge> = {
  title: 'Base/Badge',
  component: Badge,
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'info', 'warning', 'danger', 'success', 'muted'],
    },
    theme: {
      control: { type: 'select' },
      options: ['solid', 'outline', 'light'],
    },
  },
  args: {
    type: 'muted',
    theme: 'solid',
    children: 'Badge',
  },
}

export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {}

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge type="primary">Primary</Badge>
      <Badge type="secondary">Secondary</Badge>
      <Badge type="tertiary">Tertiary</Badge>
      <Badge type="quaternary">Quaternary</Badge>
      <Badge type="info">Info</Badge>
      <Badge type="warning">Warning</Badge>
      <Badge type="danger">Danger</Badge>
      <Badge type="success">Success</Badge>
      <Badge type="muted">Muted</Badge>
    </div>
  ),
}

export const AllThemes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge type="primary" theme="solid">Solid</Badge>
      <Badge type="primary" theme="outline">Outline</Badge>
      <Badge type="primary" theme="light">Light</Badge>
    </div>
  ),
}
