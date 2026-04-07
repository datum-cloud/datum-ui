import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { TimePicker } from '@datum-cloud/datum-ui/time-picker'
import * as React from 'react'

const meta: Meta<typeof TimePicker> = {
  title: 'Features/TimePicker',
  component: TimePicker,
  argTypes: {
    disabled: { control: 'boolean' },
    step: { control: { type: 'number' }, description: 'Step interval in seconds (e.g. 900 = 15 min)' },
    min: { control: 'text', description: 'Minimum time in HH:mm format' },
    max: { control: 'text', description: 'Maximum time in HH:mm format' },
  },
  args: {
    disabled: false,
    step: 60,
    min: '00:00',
    max: '23:59',
  },
}

export default meta

type Story = StoryObj<typeof TimePicker>

export const Default: Story = {
  render: (args) => {
    const [time, setTime] = React.useState<string>('09:00')
    return (
      <div className="w-40">
        <TimePicker
          {...args}
          value={time}
          onChange={setTime}
        />
      </div>
    )
  },
}
