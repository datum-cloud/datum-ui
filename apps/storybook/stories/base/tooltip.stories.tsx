import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { Tooltip } from '@datum-cloud/datum-ui/tooltip'
import { InfoIcon } from 'lucide-react'

const meta: Meta<typeof Tooltip> = {
  title: 'Base/Tooltip',
  component: Tooltip,
  argTypes: {
    message: {
      control: 'text',
    },
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
  args: {
    message: 'This is a tooltip',
    side: 'top',
  },
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: args => (
    <div className="flex items-center justify-center p-20">
      <Tooltip message={args.message} side={args.side}>
        <Button type="secondary" theme="outline" size="default">
          Hover me
        </Button>
      </Tooltip>
    </div>
  ),
}

export const AllSides: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8 p-20">
      <Tooltip message="Top tooltip" side="top">
        <Button type="secondary" theme="outline" size="default" icon={<InfoIcon />}>
          Top
        </Button>
      </Tooltip>
      <Tooltip message="Right tooltip" side="right">
        <Button type="secondary" theme="outline" size="default" icon={<InfoIcon />}>
          Right
        </Button>
      </Tooltip>
      <Tooltip message="Bottom tooltip" side="bottom">
        <Button type="secondary" theme="outline" size="default" icon={<InfoIcon />}>
          Bottom
        </Button>
      </Tooltip>
      <Tooltip message="Left tooltip" side="left">
        <Button type="secondary" theme="outline" size="default" icon={<InfoIcon />}>
          Left
        </Button>
      </Tooltip>
    </div>
  ),
}
