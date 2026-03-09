import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { Mail, Plus, Trash2 } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'Base/Button',
  component: Button,
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'warning', 'danger', 'success'],
    },
    theme: {
      control: { type: 'select' },
      options: ['solid', 'light', 'outline', 'borderless', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'small', 'default', 'large', 'icon', 'link'],
    },
    loading: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    block: {
      control: { type: 'boolean' },
    },
    iconPosition: {
      control: { type: 'radio' },
      options: ['left', 'right'],
    },
    icon: { control: false },
  },
  args: {
    type: 'primary',
    theme: 'solid',
    size: 'default',
    loading: false,
    disabled: false,
    block: false,
    iconPosition: 'left',
    children: 'Button',
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {}

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="primary">Primary</Button>
      <Button type="secondary">Secondary</Button>
      <Button type="tertiary">Tertiary</Button>
      <Button type="quaternary">Quaternary</Button>
      <Button type="warning">Warning</Button>
      <Button type="danger">Danger</Button>
      <Button type="success">Success</Button>
    </div>
  ),
}

export const AllThemes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="primary" theme="solid">Solid</Button>
      <Button type="primary" theme="light">Light</Button>
      <Button type="primary" theme="outline">Outline</Button>
      <Button type="primary" theme="borderless">Borderless</Button>
      <Button type="primary" theme="link" size="link">Link</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra Small</Button>
      <Button size="small">Small</Button>
      <Button size="default">Default</Button>
      <Button size="large">Large</Button>
    </div>
  ),
}

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button icon={<Mail size={16} />} iconPosition="left">Send Email</Button>
      <Button icon={<Trash2 size={16} />} iconPosition="right" type="danger">Delete</Button>
    </div>
  ),
}

export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button icon={<Plus size={16} />} size="icon" />
      <Button icon={<Plus size={16} />} size="small" />
      <Button icon={<Plus size={16} />} size="default" />
      <Button icon={<Plus size={16} />} size="large" />
    </div>
  ),
}

export const Block: Story = {
  args: {
    block: true,
    children: 'Full Width Button',
  },
}
