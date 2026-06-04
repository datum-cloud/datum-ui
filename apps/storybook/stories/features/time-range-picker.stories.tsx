import type { TimeRangeValue } from '@datum-cloud/datum-ui/date-picker'
import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { TimeRangePicker } from '@datum-cloud/datum-ui/date-picker'
import { useState } from 'react'

const meta: Meta<typeof TimeRangePicker> = {
  title: 'Features/TimeRangePicker',
  component: TimeRangePicker,
  parameters: {
    docs: {
      description: {
        component:
          'A popover-based date range picker with quick presets, calendar selection, and timezone awareness.\n\n'
          + 'TimeRangePicker lets users select a time range via quick preset buttons (e.g. "Last 24 hours", '
          + '"Last 7 days") or a calendar for custom date ranges. All values are stored as UTC ISO strings and '
          + 'the component converts to/from the user\'s timezone for display. Includes keyboard shortcuts, a '
          + 'clearable trigger, and a timezone indicator. Requires `react-day-picker`, `date-fns`, and `date-fns-tz`.',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
    side: {
      control: 'select',
      options: ['top', 'bottom'],
    },
  },
  args: {
    disabled: false,
    placeholder: 'Select time range',
    align: 'start',
    side: 'bottom',
  },
}

export default meta

type Story = StoryObj<typeof TimeRangePicker>

function DefaultStory(args: ComponentProps<typeof TimeRangePicker>) {
  const [value, setValue] = useState<TimeRangeValue | null>(null)
  return (
    <TimeRangePicker
      {...args}
      value={value}
      onChange={setValue}
      onClear={() => setValue(null)}
    />
  )
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Basic controlled usage. The picker opens a popover with preset buttons and a calendar. '
          + '`value` is `null` initially; selecting a preset or custom range calls `onChange` with a `TimeRangeValue` '
          + 'and the clear button calls `onClear`.',
      },
    },
  },
  render: args => <DefaultStory {...args} />,
}

function DisableFutureStory(args: ComponentProps<typeof TimeRangePicker>) {
  const [value, setValue] = useState<TimeRangeValue | null>(null)
  return (
    <TimeRangePicker
      {...args}
      value={value}
      onChange={setValue}
      onClear={() => setValue(null)}
      disableFuture
    />
  )
}

export const DisableFuture: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `disableFuture` to prevent selecting dates after today.',
      },
    },
  },
  render: args => <DisableFutureStory {...args} />,
}

function DisabledStory(args: ComponentProps<typeof TimeRangePicker>) {
  return (
    <TimeRangePicker
      {...args}
      value={null}
      onChange={() => {}}
      disabled
      placeholder="Disabled"
    />
  )
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set `disabled` to prevent any interaction with the picker trigger.',
      },
    },
  },
  render: args => <DisabledStory {...args} />,
}
