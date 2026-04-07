import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Tooltip } from '@datum-cloud/datum-ui/tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'Base/Tooltip',
  component: Tooltip,
  argTypes: {
    message: { control: 'text' },
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    delayDuration: { control: 'number' },
  },
  args: {
    message: 'This is a tooltip',
    side: 'top',
    delayDuration: 0,
  },
}

export default meta

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: args => (
    <div className="flex items-center justify-center p-20">
      <Tooltip {...args}>
        <button type="button" className="rounded-md border px-4 py-2 text-sm">
          Hover me
        </button>
      </Tooltip>
    </div>
  ),
}
