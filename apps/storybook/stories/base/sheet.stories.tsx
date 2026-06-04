import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@datum-cloud/datum-ui/sheet'

const meta: Meta<typeof Sheet> = {
  title: 'Base/Sheet',
  component: Sheet,
  parameters: {
    docs: {
      description: {
        component:
          'A slide-in panel anchored to a screen edge for supplementary content or forms.\n\n'
          + 'Sheet is a panel that slides in from a screen edge (`right`, `left`, `top`, or `bottom`). '
          + 'It is built on Radix UI\'s Dialog primitive and is useful for settings panels, detail '
          + 'views, and mobile navigation menus without navigating away from the current page.\n\n'
          + 'Compose with `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, '
          + '`SheetDescription`, `SheetFooter`, and `SheetClose`.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Sheet>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic sheet sliding in from the right (default) with a header, body content, and a footer with close/save actions.',
      },
    },
  },
  render: args => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button type="primary">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Adjust your preferences below.</SheetDescription>
        </SheetHeader>
        <div className="py-4 text-sm text-muted-foreground">Panel content goes here.</div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="secondary" theme="outline">Close</Button>
          </SheetClose>
          <Button type="primary">Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const SideVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `side` prop on `SheetContent` controls which edge the panel slides in from: '
          + '`right` (default), `left`, `top`, or `bottom`.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(['right', 'left', 'top', 'bottom'] as const).map(side => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button type="secondary" theme="outline">
              {side.charAt(0).toUpperCase() + side.slice(1)}
            </Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>
                Sheet —
                {side}
              </SheetTitle>
              <SheetDescription>
                Slides in from the
                {side}
                .
              </SheetDescription>
            </SheetHeader>
            <div className="py-4 text-sm text-muted-foreground">Content area.</div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="secondary" theme="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
}
