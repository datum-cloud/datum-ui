import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { DateTimePicker } from '@datum-cloud/datum-ui/picker'
import * as React from 'react'

const meta: Meta<typeof DateTimePicker> = {
  title: 'Features/Picker/DateTimePicker',
  component: DateTimePicker,
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    clearable: { control: 'boolean' },
    timezone: { control: 'text' },
    hideTimezone: { control: 'boolean' },
    hourCycle: { control: { type: 'select' }, options: ['12', '24'] },
  },
  args: {
    disabled: false,
    placeholder: 'Pick a date & time',
    clearable: true,
    timezone: 'UTC',
    hideTimezone: false,
    hourCycle: '24',
  },
}

export default meta

type Story = StoryObj<typeof DateTimePicker>

function DefaultStory(args: React.ComponentProps<typeof DateTimePicker>) {
  const [value, setValue] = React.useState<string | null>(null)
  return (
    <div className="w-72">
      <DateTimePicker {...args} value={value} onChange={setValue} />
    </div>
  )
}

export const Default: Story = { render: args => <DefaultStory {...args} /> }
