import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { InputNumber } from '@datum-cloud/datum-ui/input-number'

const meta: Meta<typeof InputNumber> = {
  title: 'Features/InputNumber',
  component: InputNumber,
  parameters: {
    docs: {
      description: {
        component:
          'A numeric input with increment/decrement stepper buttons and formatting support.\n\n'
          + 'The `InputNumber` component provides a formatted numeric input with stepper buttons for '
          + 'incrementing and decrementing. It is built on `react-number-format` and supports min/max '
          + 'constraints, thousand separators, decimal scales, prefix/suffix display, and keyboard '
          + 'arrow controls.\n\n'
          + 'Requires the `react-number-format` package.',
      },
    },
  },
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    stepper: { control: 'number' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    suffix: { control: 'text' },
    prefix: { control: 'text' },
    decimalScale: { control: 'number' },
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Basic numeric input with stepper buttons. Use the controls to adjust `min`, `max`, `stepper`, '
          + 'and `disabled`. Arrow keys also increment/decrement while the input is focused.',
      },
    },
  },
  render: args => (
    <div className="w-48">
      <InputNumber {...args} />
    </div>
  ),
}

export const WithMinMaxAndStep: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `min`, `max`, and `stepper` to constrain the value range and step size. '
          + 'The stepper buttons are disabled when the value reaches the boundary.',
      },
    },
  },
  render: () => (
    <div className="w-48">
      <InputNumber min={0} max={100} stepper={5} defaultValue={50} placeholder="0 - 100" />
    </div>
  ),
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set `disabled` to `true` to prevent all interaction with the input and stepper buttons.',
      },
    },
  },
  render: () => (
    <div className="w-48">
      <InputNumber disabled defaultValue={42} />
    </div>
  ),
}

export const WithSuffix: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the `suffix` prop to append a unit label after the value, or `prefix` to prepend one. '
          + 'The example shows a percentage suffix.',
      },
    },
  },
  render: () => (
    <div className="w-48">
      <InputNumber defaultValue={75} suffix="%" />
    </div>
  ),
}
