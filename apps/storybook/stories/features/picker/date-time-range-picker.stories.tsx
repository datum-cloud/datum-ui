import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { DateTimeRangePicker } from '@datum-cloud/datum-ui/picker'
import * as React from 'react'

const meta: Meta<typeof DateTimeRangePicker> = {
  title: 'Features/Picker/DateTimeRangePicker',
  component: DateTimeRangePicker,
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
    placeholder: 'Pick a date & time range',
    clearable: true,
    timezone: 'UTC',
    hideTimezone: false,
    numberOfMonths: 2,
  },
}

export default meta

type Story = StoryObj<typeof DateTimeRangePicker>

function DefaultStory(args: React.ComponentProps<typeof DateTimeRangePicker>) {
  const [value, setValue] = React.useState<{ from: string, to: string } | null>(null)
  return (
    <div className="w-[28rem]">
      <DateTimeRangePicker {...args} value={value} onChange={setValue} />
    </div>
  )
}

export const Default: Story = { render: args => <DefaultStory {...args} /> }
