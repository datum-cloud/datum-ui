import type { TimeRangeValue } from '@datum-cloud/datum-ui/date-picker'
import type { ComponentProps } from 'react'
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

function DefaultStory(args: ComponentProps<typeof TimeRangePicker>) {
  const [value, setValue] = useState<TimeRangeValue | null>(null)
  return (
    <TimeRangePicker
      {...args}
      value={value}
      onChange={setValue}
      onClear={() => setValue(null)}
    />
  )
}

export const Default: Story = {
  render: args => <DefaultStory {...args} />,
}
