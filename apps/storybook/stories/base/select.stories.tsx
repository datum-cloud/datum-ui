import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@datum-cloud/datum-ui/select'

const meta: Meta<typeof Select> = {
  title: 'Base/Select',
  component: Select,
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof Select>

export const Default: Story = {
  render: args => (
    <Select {...args}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
      </SelectContent>
    </Select>
  ),
}
