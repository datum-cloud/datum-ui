import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@datum-cloud/datum-ui/collapsible'
import { ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

const meta: Meta<typeof Collapsible> = {
  title: 'Base/Collapsible',
  component: Collapsible,
  parameters: {
    docs: {
      description: {
        component:
          'A component that toggles the visibility of its content with expand/collapse behavior.\n\n'
          + 'Collapsible is a thin wrapper around Radix UI\'s Collapsible primitive. It lets users '
          + 'expand and collapse a section of content, useful for FAQs, advanced settings panels, '
          + 'or any progressive-disclosure pattern.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Basic collapsible with a toggle button that shows and hides additional items.',
      },
    },
  },
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

function ControlledCollapsible() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[350px] space-y-2">
      <CollapsibleTrigger asChild>
        <Button type="secondary" theme="outline" size="small">
          {isOpen ? 'Hide' : 'Show'}
          {' '}
          Details
          <ChevronsUpDown className="ml-2 size-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="mt-2 text-sm text-muted-foreground">
          Detailed information revealed on demand.
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
}

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `open` and `onOpenChange` for controlled state. The trigger label updates to reflect the current state.',
      },
    },
  },
  render: () => <ControlledCollapsible />,
}
