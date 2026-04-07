import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Separator } from '@datum-cloud/datum-ui/separator'

const meta: Meta<typeof Separator> = {
  title: 'Base/Separator',
  component: Separator,
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    decorative: {
      control: 'boolean',
    },
  },
  args: {
    orientation: 'horizontal',
    decorative: true,
  },
}

export default meta

type Story = StoryObj<typeof Separator>

export const Default: Story = {
  render: args => (
    <div className="w-full max-w-md">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Datum UI</h4>
        <p className="text-muted-foreground text-sm">An open-source component library.</p>
      </div>
      <Separator className="my-4" {...args} />
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Components</h4>
        <p className="text-muted-foreground text-sm">Build your interface with reusable components.</p>
      </div>
    </div>
  ),
}
