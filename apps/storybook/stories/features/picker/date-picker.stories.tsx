import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { DatePicker } from '@datum-cloud/datum-ui/picker'
import * as React from 'react'

const meta: Meta<typeof DatePicker> = {
  title: 'Features/Picker/DatePicker',
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component:
          'Unified date and time picker family — single date, date range, time, time range, datetime, datetime range, and date-range-with-time, all sharing one mental model.\n\n'
          + 'The Picker family covers every realistic combination of date and time selection through one consistent API. '
          + 'Each wrapper (`DatePicker`, `DateRangePicker`, `TimePicker`, `TimeRangePicker`, `DateTimePicker`, '
          + '`DateTimeRangePicker`, `DateRangeTimePicker`) has a typed `value` and fixed default layout. '
          + 'For custom layouts the same primitives the wrappers compose are also exported via `Picker.*`. '
          + 'All wrappers share `WrapperBaseProps` including `disabled`, `clearable`, `disablePast`, `disableFuture`, '
          + '`minDate`, `maxDate`, `presets`, `excludePresets`, `commit`, `responsive`, and `timezone` (time-bearing modes). '
          + 'Requires `react-day-picker`, `date-fns`, and `date-fns-tz`.',
      },
    },
  },
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Single date selection. `onChange` fires immediately on selection and the popover closes. '
          + 'Use `disablePast` or `disableFuture` to constrain the calendar; use `presets` to provide quick-select options.',
      },
    },
  },
  render: args => <DefaultStory {...args} />,
}
