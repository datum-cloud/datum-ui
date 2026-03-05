import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Separator } from '@datum-cloud/datum-ui/separator'

const meta: Meta<typeof Separator> = {
  title: 'Base/Separator',
  component: Separator,
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
  args: {
    orientation: 'horizontal',
  },
}

export default meta
type Story = StoryObj<typeof Separator>

export const Default: Story = {
  render: args => (
    <div className="w-full max-w-md">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Datum UI</h4>
        <p className="text-sm text-muted-foreground">
          An open-source component library.
        </p>
      </div>
      <Separator className="my-4" orientation={args.orientation} />
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Components</h4>
        <p className="text-sm text-muted-foreground">
          Build your interface with reusable components.
        </p>
      </div>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Blog</span>
      <Separator orientation="vertical" />
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Source</span>
    </div>
  ),
}
