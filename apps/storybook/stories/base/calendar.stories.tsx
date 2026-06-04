import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Calendar } from '@datum-cloud/datum-ui/calendar'
import { useState } from 'react'

function SingleDateSelectionExample() {
  const [date, setDate] = useState<Date | undefined>(() => new Date())
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
    />
  )
}

const meta: Meta<typeof Calendar> = {
  title: 'Base/Calendar',
  component: Calendar,
  parameters: {
    docs: {
      description: {
        component:
          'A date picker calendar built on react-day-picker with Datum styling.\n\n'
          + 'The Calendar component renders an interactive month calendar. It supports single-date '
          + 'selection, date ranges, outside-day display, and multiple months. Built on `react-day-picker` '
          + 'v4 with Datum design tokens applied to navigation, day cells, and range highlighting.',
      },
    },
  },
  argTypes: {
    showOutsideDays: {
      control: 'boolean',
    },
    numberOfMonths: {
      control: 'number',
    },
  },
  args: {
    showOutsideDays: true,
    numberOfMonths: 1,
  },
}

export default meta

type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic calendar render with default settings (no selection mode).',
      },
    },
  },
  render: args => <Calendar {...args} />,
}

export const SingleDateSelection: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controlled single-date selection. The selected date is highlighted and updated via `onSelect`.',
      },
    },
  },
  render: () => <SingleDateSelectionExample />,
}

export const MultiMonth: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Display multiple months side by side using the `numberOfMonths` prop.',
      },
    },
  },
  render: () => (
    <Calendar
      mode="single"
      numberOfMonths={2}
    />
  ),
}
