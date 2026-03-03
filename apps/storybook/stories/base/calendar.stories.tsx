import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Calendar } from '@datum-cloud/datum-ui'
import * as React from 'react'

const meta: Meta<typeof Calendar> = {
  title: 'Base/Calendar',
  component: Calendar,
  argTypes: {
    showOutsideDays: {
      control: { type: 'boolean' },
    },
    numberOfMonths: {
      control: { type: 'number' },
    },
  },
  args: {
    showOutsideDays: true,
  },
}

export default meta

type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  render: args => <Calendar {...args} />,
}

export const WithSelectedDate: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
      />
    )
  },
}
