import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { DatePicker } from '@datum-cloud/datum-ui/picker'
import * as React from 'react'

const meta: Meta<typeof DatePicker> = {
  title: 'Features/Picker/DatePicker',
  component: DatePicker,
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    clearable: { control: 'boolean' },
    numberOfMonths: { control: { type: 'select' }, options: [1, 2] },
  },
  args: {
    disabled: false,
    placeholder: 'Pick a date',
    clearable: true,
    numberOfMonths: 1,
  },
}

export default meta

type Story = StoryObj<typeof DatePicker>

function DefaultStory(args: React.ComponentProps<typeof DatePicker>) {
  const [value, setValue] = React.useState<Date | null>(null)
  return (
    <div className="w-72">
      <DatePicker {...args} value={value} onChange={setValue} />
    </div>
  )
}

export const Default: Story = { render: args => <DefaultStory {...args} /> }
