import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Textarea } from '@datum-cloud/datum-ui/textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Base/Textarea',
  component: Textarea,
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    rows: { control: 'number' },
  },
  args: {
    placeholder: 'Type your message...',
    disabled: false,
    readOnly: false,
    rows: 4,
  },
}

export default meta

type Story = StoryObj<typeof Textarea>

export const Default: Story = {}
