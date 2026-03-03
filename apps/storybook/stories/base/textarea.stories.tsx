import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Textarea } from '@datum-cloud/datum-ui'

const meta: Meta<typeof Textarea> = {
  title: 'Base/Textarea',
  component: Textarea,
  argTypes: {
    placeholder: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    rows: {
      control: { type: 'number' },
    },
  },
  args: {
    placeholder: 'Type your message...',
    disabled: false,
    rows: 4,
  },
}

export default meta

type Story = StoryObj<typeof Textarea>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled textarea',
  },
}
