import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { InputWithAddons } from '@datum-cloud/datum-ui/input-with-addons'
import { Link, Mail, Search } from 'lucide-react'

const meta: Meta<typeof InputWithAddons> = {
  title: 'Features/InputWithAddons',
  component: InputWithAddons,
  argTypes: {
    placeholder: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  args: {
    placeholder: 'Enter text...',
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof InputWithAddons>

export const Default: Story = {
  render: args => (
    <InputWithAddons
      {...args}
      leading={<Search size={16} />}
      placeholder="Search..."
    />
  ),
}

export const WithSuffix: Story = {
  render: args => (
    <InputWithAddons
      {...args}
      trailing={<Mail size={16} />}
      placeholder="you@example.com"
    />
  ),
}

export const WithBothAddons: Story = {
  render: args => (
    <InputWithAddons
      {...args}
      leading={<Link size={16} />}
      trailing={<span className="text-xs text-muted-foreground">.com</span>}
      placeholder="your-website"
    />
  ),
}
