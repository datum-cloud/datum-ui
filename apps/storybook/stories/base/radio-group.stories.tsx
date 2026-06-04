import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Label } from '@datum-cloud/datum-ui/label'
import { RadioGroup, RadioGroupItem } from '@datum-cloud/datum-ui/radio-group'

const meta: Meta<typeof RadioGroup> = {
  title: 'Base/RadioGroup',
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component:
          'A set of mutually exclusive radio options built on Radix UI RadioGroup.\n\n'
          + 'The `RadioGroup` component renders a group of radio buttons where only one option '
          + 'can be selected at a time. It uses Radix UI RadioGroup for accessible keyboard '
          + 'navigation and focus management.\n\n'
          + 'Compose `RadioGroup` with `RadioGroupItem` children. Each item requires a unique '
          + '`value` and an `id` matching the associated `Label`\'s `htmlFor`.',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    defaultValue: { control: 'text' },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
  },
  args: {
    disabled: false,
    defaultValue: 'option-1',
    orientation: 'vertical',
  },
}

export default meta

type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic radio group with three options. Use the controls to toggle `disabled` or change `defaultValue`.',
      },
    },
  },
  render: args => (
    <RadioGroup {...args}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="option-1" />
        <Label htmlFor="option-1">Option One</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="option-2" />
        <Label htmlFor="option-2">Option Two</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-3" id="option-3" />
        <Label htmlFor="option-3">Option Three</Label>
      </div>
    </RadioGroup>
  ),
}

export const WithDefaultValue: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `defaultValue` to pre-select an option in uncontrolled mode.',
      },
    },
  },
  render: () => (
    <RadioGroup defaultValue="option-2">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="default-1" />
        <Label htmlFor="default-1">Option One</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="default-2" />
        <Label htmlFor="default-2">Option Two</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-3" id="default-3" />
        <Label htmlFor="default-3">Option Three</Label>
      </div>
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set `disabled` on `RadioGroup` to disable all items at once.',
      },
    },
  },
  render: () => (
    <RadioGroup disabled defaultValue="option-1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="disabled-1" />
        <Label htmlFor="disabled-1">Option One</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="disabled-2" />
        <Label htmlFor="disabled-2">Option Two</Label>
      </div>
    </RadioGroup>
  ),
}
