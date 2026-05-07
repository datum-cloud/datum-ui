import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { DateRangePicker } from '@datum-cloud/datum-ui/picker'
import * as React from 'react'

const meta: Meta<typeof DateRangePicker> = {
  title: 'Features/Picker/DateRangePicker',
  component: DateRangePicker,
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    clearable: { control: 'boolean' },
    numberOfMonths: { control: { type: 'select' }, options: [1, 2] },
  },
  args: {
    disabled: false,
    placeholder: 'Pick a date range',
    clearable: true,
    numberOfMonths: 2,
  },
}

export default meta

type Story = StoryObj<typeof DateRangePicker>

function DefaultStory(args: React.ComponentProps<typeof DateRangePicker>) {
  const [value, setValue] = React.useState<{ from: Date, to: Date } | null>(null)
  return (
    <div className="w-[28rem]">
      <DateRangePicker {...args} value={value} onChange={setValue} />
    </div>
  )
}

export const Default: Story = { render: args => <DefaultStory {...args} /> }
