import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { DateTimePicker } from '@datum-cloud/datum-ui/date-time-picker'
import * as React from 'react'

const meta: Meta<typeof DateTimePicker> = {
  title: 'Features/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DateTimePicker>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>()

    return (
      <div className="space-y-4">
        <DateTimePicker
          value={value}
          onChange={setValue}
          placeholder="Select date and time"
        />
        <pre className="text-xs">
          Value:
          {value || 'undefined'}
        </pre>
      </div>
    )
  },
}

export const WithTimezone: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>()

    return (
      <div className="space-y-4">
        <DateTimePicker
          value={value}
          onChange={setValue}
          showTimezoneIndicator
          placeholder="Select date and time"
        />
        <pre className="text-xs">
          Value:
          {value || 'undefined'}
        </pre>
      </div>
    )
  },
}

export const WithConstraints: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>()
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    return (
      <div className="space-y-4">
        <DateTimePicker
          value={value}
          onChange={setValue}
          minDate={today}
          maxDate={nextWeek}
          placeholder="Select within next week"
        />
        <pre className="text-xs">
          Value:
          {value || 'undefined'}
        </pre>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>()

    return (
      <div className="space-y-4">
        <DateTimePicker
          value={value}
          onChange={setValue}
          disabled
          placeholder="Disabled"
        />
        <pre className="text-xs">
          Value:
          {value || 'undefined'}
        </pre>
      </div>
    )
  },
}

export const PrefilledValue: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>('2024-01-15T14:30:00Z')

    return (
      <div className="space-y-4">
        <DateTimePicker
          value={value}
          onChange={setValue}
          showTimezoneIndicator
          placeholder="Select date and time"
        />
        <pre className="text-xs">
          Value:
          {value || 'undefined'}
        </pre>
      </div>
    )
  },
}
