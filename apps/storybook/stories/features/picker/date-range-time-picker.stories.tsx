import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { DateRangeTimePicker } from '@datum-cloud/datum-ui/picker'
import * as React from 'react'

const meta: Meta<typeof DateRangeTimePicker> = {
  title: 'Features/Picker/DateRangeTimePicker',
  component: DateRangeTimePicker,
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    clearable: { control: 'boolean' },
    timezone: { control: 'text' },
    hideTimezone: { control: 'boolean' },
    numberOfMonths: { control: { type: 'select' }, options: [1, 2] },
  },
  args: {
    disabled: false,
    placeholder: 'Pick a date range with time',
    clearable: true,
    timezone: 'UTC',
    hideTimezone: false,
    numberOfMonths: 2,
  },
}

export default meta

type Story = StoryObj<typeof DateRangeTimePicker>

function DefaultStory(args: React.ComponentProps<typeof DateRangeTimePicker>) {
  const [value, setValue] = React.useState<{ from: string, to: string } | null>(null)
  return (
    <div className="w-[28rem]">
      <DateRangeTimePicker {...args} value={value} onChange={setValue} />
    </div>
  )
}

export const Default: Story = { render: args => <DefaultStory {...args} /> }
