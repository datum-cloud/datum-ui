import type { TimeRangeValue } from '@datum-cloud/datum-ui/date-picker'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { TimeRangePicker } from '@datum-cloud/datum-ui/date-picker'
import { useState } from 'react'

const meta: Meta<typeof TimeRangePicker> = {
  title: 'Features/TimeRangePicker',
  component: TimeRangePicker,
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
    side: {
      control: 'select',
      options: ['top', 'bottom'],
    },
  },
  args: {
    disabled: false,
    placeholder: 'Select time range',
    align: 'start',
    side: 'bottom',
  },
}

export default meta

type Story = StoryObj<typeof TimeRangePicker>

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<TimeRangeValue | null>(null)
    return (
      <TimeRangePicker
        {...args}
        value={value}
        onChange={setValue}
        onClear={() => setValue(null)}
      />
    )
  },
}
