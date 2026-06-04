import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Separator } from '@datum-cloud/datum-ui/separator'

const meta: Meta<typeof Separator> = {
  title: 'Base/Separator',
  component: Separator,
  parameters: {
    docs: {
      description: {
        component:
          'A visual divider for separating content sections horizontally or vertically.\n\n'
          + 'The Separator component renders a thin line to visually divide content. It supports '
          + 'horizontal and vertical orientations and is built on `@radix-ui/react-separator` '
          + 'with accessible defaults.\n\n'
          + 'By default the separator is decorative (hidden from screen readers). Set '
          + '`decorative={false}` to expose it as a semantic separator to assistive technology.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Horizontal separator dividing two content blocks. Use the controls to switch orientation or toggle the `decorative` prop.',
      },
    },
  },
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

export const Horizontal: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default orientation is horizontal, rendering a full-width line between stacked sections.',
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <p className="text-sm">Section one content</p>
      <Separator />
      <p className="text-sm">Section two content</p>
      <Separator />
      <p className="text-sm">Section three content</p>
    </div>
  ),
}

export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `orientation="vertical"` to render a divider between inline elements. '
          + 'The parent container must have a defined height.',
      },
    },
  },
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

export const Decorative: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'By default `decorative={true}` hides the separator from screen readers. '
          + 'Set `decorative={false}` to expose it as a semantic separator to assistive technology.',
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div>
        <p className="text-muted-foreground mb-2 text-xs">decorative (default)</p>
        <Separator />
      </div>
      <div>
        <p className="text-muted-foreground mb-2 text-xs">decorative=false</p>
        <Separator decorative={false} />
      </div>
    </div>
  ),
}
