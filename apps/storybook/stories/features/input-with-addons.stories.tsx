import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { InputWithAddons } from '@datum-cloud/datum-ui/input-with-addons'
import { DollarSign, Search } from 'lucide-react'

const meta: Meta<typeof InputWithAddons> = {
  title: 'Features/InputWithAddons',
  component: InputWithAddons,
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    placeholder: 'Enter text...',
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof InputWithAddons>

export const Default: Story = {
  render: args => (
    <div className="flex w-80 flex-col gap-3">
      <InputWithAddons
        {...args}
        leading={<Search size={16} />}
        placeholder="Search..."
      />
      <InputWithAddons
        {...args}
        leading={<DollarSign size={16} />}
        trailing={<span className="text-muted-foreground text-xs">USD</span>}
        placeholder="0.00"
      />
    </div>
  ),
}
