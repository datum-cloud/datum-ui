import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { DateTimePicker } from '@datum-cloud/datum-ui/date-time-picker'
import * as React from 'react'

const meta: Meta<typeof DateTimePicker> = {
  title: 'Features/DateTimePicker',
  component: DateTimePicker,
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    showTimezoneIndicator: { control: 'boolean' },
  },
  args: {
    disabled: false,
    placeholder: 'Select date and time',
    showTimezoneIndicator: false,
  },
}

export default meta

type Story = StoryObj<typeof DateTimePicker>

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<string | undefined>(undefined)
    return (
      <div className="w-72">
        <DateTimePicker
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}
