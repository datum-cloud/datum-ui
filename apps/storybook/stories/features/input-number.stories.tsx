import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { InputNumber } from '@datum-cloud/datum-ui/input-number'

const meta: Meta<typeof InputNumber> = {
  title: 'Features/InputNumber',
  component: InputNumber,
  argTypes: {
    min: {
      control: { type: 'number' },
    },
    max: {
      control: { type: 'number' },
    },
    stepper: {
      control: { type: 'number' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  args: {
    stepper: 1,
    placeholder: 'Enter number',
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof InputNumber>

export const Default: Story = {}

export const WithMinMax: Story = {
  args: {
    min: 0,
    max: 100,
    stepper: 5,
    defaultValue: 50,
    placeholder: '0 - 100',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 42,
  },
}
