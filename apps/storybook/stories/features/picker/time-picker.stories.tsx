import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { TimePicker } from '@datum-cloud/datum-ui/picker'
import * as React from 'react'

const meta: Meta<typeof TimePicker> = {
  title: 'Features/Picker/TimePicker',
  component: TimePicker,
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    clearable: { control: 'boolean' },
    step: { control: { type: 'select' }, options: [1, 5, 10, 15, 30, 60] },
    hourCycle: { control: { type: 'select' }, options: ['12', '24'] },
  },
  args: {
    disabled: false,
    placeholder: 'Pick a time',
    clearable: true,
    step: 15,
    hourCycle: '24',
  },
}

export default meta

type Story = StoryObj<typeof TimePicker>

function DefaultStory(args: React.ComponentProps<typeof TimePicker>) {
  const [value, setValue] = React.useState<string | null>(null)
  return (
    <div className="w-72">
      <TimePicker {...args} value={value} onChange={setValue} />
    </div>
  )
}

export const Default: Story = { render: args => <DefaultStory {...args} /> }
