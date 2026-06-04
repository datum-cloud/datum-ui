import type { DateRange } from 'react-day-picker'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { CalendarDatePicker } from '@datum-cloud/datum-ui/date-picker'
import * as React from 'react'

const meta: Meta<typeof CalendarDatePicker> = {
  title: 'Features/CalendarDatePicker',
  component: CalendarDatePicker,
  parameters: {
    docs: {
      description: {
        component:
          'A date range picker with presets, month/year selectors, and constraint support.\n\n'
          + '`CalendarDatePicker` combines a trigger button, popover calendar, and date-range presets '
          + 'into a complete date picking experience. It supports single-date or dual-month range selection, '
          + 'date constraints (`minDate`, `maxDate`, `disableFuture`, `disablePast`), maximum range limits, '
          + 'and custom or default presets such as "This Week" and "Last Month".\n\n'
          + 'Requires `react-day-picker`, `date-fns`, and `date-fns-tz`.',
      },
    },
  },
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

function DefaultStory(args: React.ComponentProps<typeof CalendarDatePicker>) {
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
}

function DateRangeStory() {
  const today = new Date()
  const [date, setDate] = React.useState<DateRange>({
    from: new Date(today.getFullYear(), 0, 1),
    to: new Date(today.getFullYear(), 11, 31),
  })

  return (
    <div className="w-80">
      <CalendarDatePicker
        date={date}
        onDateSelect={(range) => {
          if (range)
            setDate(range)
        }}
        numberOfMonths={2}
        variant="outline"
        placeholder="Select date range"
      />
    </div>
  )
}

function DisableFutureStory() {
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
        disableFuture
        variant="outline"
        placeholder="Pick a past date"
      />
    </div>
  )
}

function CloseOnSelectStory() {
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
        closeOnSelect
        variant="outline"
        placeholder="Pick a date"
      />
    </div>
  )
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Basic usage with today\'s date pre-selected. '
          + 'Click the trigger to open the calendar popover and select a date or range. '
          + 'Click "Apply" to confirm the selection.',
      },
    },
  },
  render: args => <DefaultStory {...args} />,
}

export const DateRangeTwoMonths: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `numberOfMonths={2}` to show a dual-month calendar, making it easier to pick date ranges '
          + 'that span across month boundaries.',
      },
    },
  },
  render: () => <DateRangeStory />,
}

export const DisableFutureDates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `disableFuture` to prevent selecting dates after today. '
          + 'Useful for "date of birth" or historical date fields.',
      },
    },
  },
  render: () => <DisableFutureStory />,
}

export const CloseOnSelect: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'By default the picker stays open until the user clicks "Apply". '
          + 'Set `closeOnSelect` to auto-close the popover immediately after a date is selected.',
      },
    },
  },
  render: () => <CloseOnSelectStory />,
}
