import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Input } from '@datum-cloud/datum-ui/input'

const meta: Meta<typeof Input> = {
  title: 'Base/Input',
  component: Input,
  argTypes: {
    placeholder: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number'],
    },
  },
  args: {
    placeholder: 'Enter text...',
    disabled: false,
    type: 'text',
  },
}

export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
}

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'you@example.com',
    type: 'email',
  },
}
