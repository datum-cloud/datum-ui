import type { TimeRangeValue } from '@datum-cloud/datum-ui'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { DEFAULT_PRESETS, TimeRangePicker } from '@datum-cloud/datum-ui'
import { useState } from 'react'

const meta: Meta<typeof TimeRangePicker> = {
  title: 'Features/TimeRangePicker',
  component: TimeRangePicker,
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    disableFuture: {
      control: { type: 'boolean' },
    },
    placeholder: {
      control: { type: 'text' },
    },
    align: {
      control: { type: 'select' },
      options: ['start', 'center', 'end'],
    },
    side: {
      control: { type: 'select' },
      options: ['top', 'bottom'],
    },
  },
  args: {
    disabled: false,
    disableFuture: false,
    placeholder: 'Select time range',
    align: 'start',
    side: 'bottom',
  },
}

export default meta

type Story = StoryObj<typeof TimeRangePicker>

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<TimeRangeValue | null>(null)
    return (
      <TimeRangePicker
        {...args}
        value={value}
        onChange={setValue}
        onClear={() => setValue(null)}
      />
    )
  },
}

export const WithQuickRanges: Story = {
  render: () => {
    const [value, setValue] = useState<TimeRangeValue | null>(null)
    return (
      <TimeRangePicker
        value={value}
        onChange={setValue}
        onClear={() => setValue(null)}
        presets={DEFAULT_PRESETS}
        placeholder="Choose a time range"
      />
    )
  },
}

export const CustomRange: Story = {
  render: () => {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const [value, setValue] = useState<TimeRangeValue>({
      type: 'custom',
      from: oneWeekAgo.toISOString(),
      to: now.toISOString(),
    })
    return (
      <TimeRangePicker
        value={value}
        onChange={setValue}
        onClear={() =>
          setValue({
            type: 'custom',
            from: oneWeekAgo.toISOString(),
            to: now.toISOString(),
          })}
        disableFuture
      />
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <TimeRangePicker
      value={null}
      onChange={() => {}}
      disabled
      placeholder="Disabled"
    />
  ),
}
