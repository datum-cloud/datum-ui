import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { DateTimePicker } from '@datum-cloud/datum-ui/date-time-picker'
import * as React from 'react'

const meta: Meta<typeof DateTimePicker> = {
  title: 'Features/DateTimePicker',
  component: DateTimePicker,
  parameters: {
    docs: {
      description: {
        component:
          'Combined date and time selection with timezone support and form integration.\n\n'
          + '`DateTimePicker` provides a combined date and time input with a calendar popover for date '
          + 'selection and a time input field. It supports timezone-aware datetime handling, storing '
          + 'values in UTC ISO 8601 format (e.g. `2024-03-15T14:30:00.000Z`) while displaying them '
          + 'in the user\'s local timezone.\n\n'
          + 'Requires `react-day-picker`, `date-fns`, and `date-fns-tz`.',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    showTimezoneIndicator: { control: 'boolean' },
    disableFuture: { control: 'boolean' },
    disablePast: { control: 'boolean' },
    modal: { control: 'boolean' },
  },
  args: {
    disabled: false,
    placeholder: 'Select date and time',
    showTimezoneIndicator: false,
    disableFuture: false,
    disablePast: false,
    modal: false,
  },
}

export default meta

type Story = StoryObj<typeof DateTimePicker>

function DefaultStory(args: React.ComponentProps<typeof DateTimePicker>) {
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
}

function WithTimezoneStory() {
  const [value, setValue] = React.useState<string | undefined>(undefined)
  return (
    <div className="w-72">
      <DateTimePicker
        value={value}
        onChange={setValue}
        showTimezoneIndicator
        placeholder="Select date and time"
      />
    </div>
  )
}

function WithConstraintsStory() {
  const [value, setValue] = React.useState<string | undefined>(undefined)
  return (
    <div className="w-72">
      <DateTimePicker
        value={value}
        onChange={setValue}
        disableFuture
        placeholder="Select a past date"
      />
    </div>
  )
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Basic usage combining date calendar and time input. '
          + 'The selected value is stored in UTC ISO 8601 format and displayed in the user\'s local timezone.',
      },
    },
  },
  render: args => <DefaultStory {...args} />,
}

export const WithTimezoneIndicator: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `showTimezoneIndicator` to display the user\'s timezone abbreviation (e.g. "EST") '
          + 'next to the time input, clarifying which timezone the displayed time corresponds to.',
      },
    },
  },
  render: () => <WithTimezoneStory />,
}

export const WithDateConstraints: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `disableFuture` or `disablePast` to restrict selectable dates. '
          + '`minDate` and `maxDate` props offer explicit date boundaries.',
      },
    },
  },
  render: () => <WithConstraintsStory />,
}
