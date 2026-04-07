import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Input } from '@datum-cloud/datum-ui/input'

const meta: Meta<typeof Input> = {
  title: 'Base/Input',
  component: Input,
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
  },
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    disabled: false,
    readOnly: false,
  },
}

export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {}
