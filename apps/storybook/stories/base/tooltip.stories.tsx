import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Tooltip } from '@datum-cloud/datum-ui/tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'Base/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          '**Mobile long-press support**: On touch devices the tooltip activates after a 500 ms press and auto-dismisses after 1 500 ms. No tap-away is needed. This behaviour cannot be demoed directly in Storybook because the canvas does not simulate touch events — use a real mobile device or browser DevTools touch emulation to verify it.',
      },
    },
  },
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
