import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { Input } from '@datum-cloud/datum-ui/input'
import { Label } from '@datum-cloud/datum-ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@datum-cloud/datum-ui/popover'

const meta: Meta<typeof Popover> = {
  title: 'Base/Popover',
  component: Popover,
  parameters: {
    docs: {
      description: {
        component:
          'A floating panel anchored to a trigger element for rich interactive content.\n\n'
          + 'Popover displays rich content in a floating panel anchored to a trigger element. '
          + 'Unlike a tooltip (text-only, hover-activated), a popover can contain forms, buttons, '
          + 'or any interactive content and is opened by clicking the trigger. It is built on '
          + 'Radix UI\'s Popover primitive.\n\n'
          + 'Compose with `PopoverTrigger` (the element that opens the panel), `PopoverContent` '
          + '(the floating panel), and the optional `PopoverAnchor` for a custom anchor point.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Popover>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic popover opened by clicking a button trigger. Content defaults to center-aligned.',
      },
    },
  },
  render: args => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button type="secondary" theme="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium">Settings</h4>
          <p className="text-muted-foreground text-sm">
            Configure your preferences for this workspace.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const Alignment: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `align` prop on `PopoverContent` controls horizontal alignment relative to the '
          + 'trigger: `start` (left-aligned), `center` (default), or `end` (right-aligned).',
      },
    },
  },
  render: () => (
    <div className="flex gap-4 justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button type="secondary" theme="outline">Start</Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <p className="text-sm">Left-aligned content</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button type="secondary" theme="outline">Center</Button>
        </PopoverTrigger>
        <PopoverContent align="center">
          <p className="text-sm">Center-aligned content</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button type="secondary" theme="outline">End</Button>
        </PopoverTrigger>
        <PopoverContent align="end">
          <p className="text-sm">Right-aligned content</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
}

export const WithFormContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Popovers can contain any interactive content including form fields and action buttons.',
      },
    },
  },
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="secondary" theme="outline">Set Date Range</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input id="start-date" type="date" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input id="end-date" type="date" />
          </div>
          <Button type="primary" size="small">Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
}
