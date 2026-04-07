import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Spinner } from '@datum-cloud/datum-ui/spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Base/Spinner',
  component: Spinner,
  argTypes: {
    className: {
      control: 'text',
    },
  },
  args: {
    className: 'size-6',
  },
}

export default meta

type Story = StoryObj<typeof Spinner>

export const Default: Story = {}
