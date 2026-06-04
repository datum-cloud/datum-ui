import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Checkbox } from '@datum-cloud/datum-ui/checkbox'
import { Label } from '@datum-cloud/datum-ui/label'

const meta: Meta<typeof Checkbox> = {
  title: 'Base/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          'A toggleable checkbox control built on Radix UI Checkbox.\n\n'
          + 'The `Checkbox` component renders an accessible checkbox input. It supports checked, '
          + 'unchecked, and indeterminate states, and is styled with Datum design tokens.',
      },
    },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    defaultChecked: {
      control: 'boolean',
    },
  },
  args: {
    disabled: false,
    defaultChecked: false,
  },
}

export default meta

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic usage of the Checkbox component paired with a label.',
      },
    },
  },
  render: args => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" {...args} />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

export const CheckedByDefault: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pass `defaultChecked` to render the checkbox in a checked state on first render.',
      },
    },
  },
  args: {
    defaultChecked: true,
  },
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set `disabled` to prevent interaction. The checkbox renders with reduced opacity.',
      },
    },
  },
  args: {
    disabled: true,
  },
}
