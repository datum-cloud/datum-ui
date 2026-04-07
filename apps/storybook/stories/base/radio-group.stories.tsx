import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Label } from '@datum-cloud/datum-ui/label'
import { RadioGroup, RadioGroupItem } from '@datum-cloud/datum-ui/radio-group'

const meta: Meta<typeof RadioGroup> = {
  title: 'Base/RadioGroup',
  component: RadioGroup,
  argTypes: {
    disabled: { control: 'boolean' },
    defaultValue: { control: 'text' },
  },
  args: {
    disabled: false,
    defaultValue: 'option-1',
  },
}

export default meta

type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
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
