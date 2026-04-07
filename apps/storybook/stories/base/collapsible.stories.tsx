import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@datum-cloud/datum-ui/collapsible'
import { ChevronsUpDown } from 'lucide-react'

const meta: Meta<typeof Collapsible> = {
  title: 'Base/Collapsible',
  component: Collapsible,
  argTypes: {
    defaultOpen: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    defaultOpen: false,
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
  render: args => (
    <Collapsible {...args} className="w-[350px] space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">3 items</h4>
        <CollapsibleTrigger asChild>
          <Button type="secondary" theme="borderless" size="icon">
            <ChevronsUpDown className="size-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-3 text-sm">Item 1</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 text-sm">Item 2</div>
        <div className="rounded-md border px-4 py-3 text-sm">Item 3</div>
      </CollapsibleContent>
    </Collapsible>
  ),
}
