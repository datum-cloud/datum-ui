import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { InputNumber } from '@datum-cloud/datum-ui/input-number'

const meta: Meta<typeof InputNumber> = {
  title: 'Features/InputNumber',
  component: InputNumber,
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    stepper: { control: 'number' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    min: 0,
    max: 100,
    stepper: 1,
    disabled: false,
    placeholder: 'Enter number',
  },
}

export default meta

type Story = StoryObj<typeof InputNumber>

export const Default: Story = {}
