import type { DateRange } from 'react-day-picker'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { CalendarDatePicker } from '@datum-cloud/datum-ui'
import { endOfYear, startOfYear } from 'date-fns'
import * as React from 'react'

const meta: Meta<typeof CalendarDatePicker> = {
  title: 'Features/CalendarDatePicker',
  component: CalendarDatePicker,
  argTypes: {
    numberOfMonths: {
      control: { type: 'select' },
      options: [1, 2],
    },
    closeOnSelect: {
      control: { type: 'boolean' },
    },
    disableFuture: {
      control: { type: 'boolean' },
    },
    disablePast: {
      control: { type: 'boolean' },
    },
    placeholder: {
      control: { type: 'text' },
    },
  },
  args: {
    numberOfMonths: 2,
    closeOnSelect: false,
    disableFuture: false,
    disablePast: false,
    placeholder: 'Pick a date',
  },
}

export default meta

type Story = StoryObj<typeof CalendarDatePicker>

export const Default: Story = {
  render: (args) => {
    const today = new Date()
    const [date, setDate] = React.useState<DateRange>({
      from: today,
      to: today,
    })

    return (
      <div className="w-80">
        <CalendarDatePicker
          date={date}
          onDateSelect={(range) => {
            if (range) {
              setDate(range)
            }
          }}
          numberOfMonths={args.numberOfMonths}
          closeOnSelect={args.closeOnSelect}
          disableFuture={args.disableFuture}
          disablePast={args.disablePast}
          placeholder={args.placeholder}
          variant="outline"
        />
      </div>
    )
  },
}

export const DateRangeStory: Story = {
  name: 'Date Range',
  render: () => {
    const today = new Date()
    const [date, setDate] = React.useState<DateRange>({
      from: startOfYear(today),
      to: endOfYear(today),
    })

    return (
      <div className="w-96">
        <CalendarDatePicker
          date={date}
          onDateSelect={(range) => {
            if (range) {
              setDate(range)
            }
          }}
          numberOfMonths={2}
          variant="outline"
          placeholder="Select date range"
        />
      </div>
    )
  },
}
