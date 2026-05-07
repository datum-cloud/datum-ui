import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { TimeRangePicker } from '@datum-cloud/datum-ui/picker'
import * as React from 'react'

const meta: Meta<typeof TimeRangePicker> = {
  title: 'Features/Picker/TimeRangePicker',
  component: TimeRangePicker,
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    clearable: { control: 'boolean' },
    step: { control: { type: 'select' }, options: [1, 5, 10, 15, 30, 60] },
    hourCycle: { control: { type: 'select' }, options: ['12', '24'] },
  },
  args: {
    disabled: false,
    placeholder: 'Pick a time range',
    clearable: true,
    step: 30,
    hourCycle: '24',
  },
}

export default meta

type Story = StoryObj<typeof TimeRangePicker>

function DefaultStory(args: React.ComponentProps<typeof TimeRangePicker>) {
  const [value, setValue] = React.useState<{ from: string, to: string } | null>(null)
  return (
    <div className="w-72">
      <TimeRangePicker {...args} value={value} onChange={setValue} />
    </div>
  )
}

export const Default: Story = { render: args => <DefaultStory {...args} /> }
