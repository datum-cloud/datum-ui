import type { DateRange } from 'react-day-picker'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { CalendarDatePicker } from '@datum-cloud/datum-ui/date-picker'
import * as React from 'react'

const meta: Meta<typeof CalendarDatePicker> = {
  title: 'Features/CalendarDatePicker',
  component: CalendarDatePicker,
  argTypes: {
    numberOfMonths: {
      control: 'select',
      options: [1, 2],
    },
    closeOnSelect: { control: 'boolean' },
    disableFuture: { control: 'boolean' },
    disablePast: { control: 'boolean' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    numberOfMonths: 2,
    closeOnSelect: false,
    disableFuture: false,
    disablePast: false,
    placeholder: 'Pick a date',
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof CalendarDatePicker>

export const Default: Story = {
  render: (args) => {
    const today = new Date()
    const [date, setDate] = React.useState<DateRange>({ from: today, to: today })

    return (
      <div className="w-80">
        <CalendarDatePicker
          date={date}
          onDateSelect={(range) => {
            if (range)
              setDate(range)
          }}
          numberOfMonths={args.numberOfMonths}
          closeOnSelect={args.closeOnSelect}
          disableFuture={args.disableFuture}
          disablePast={args.disablePast}
          placeholder={args.placeholder}
          disabled={args.disabled}
          variant="outline"
        />
      </div>
    )
  },
}
