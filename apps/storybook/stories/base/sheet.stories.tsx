import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import {
  Sheet,
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
}

export default meta

type Story = StoryObj<typeof Sheet>

export const Default: Story = {
  render: args => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button type="primary">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>This is a sheet panel that slides in from the side.</SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <p className="text-muted-foreground text-sm">
            Sheet content goes here. Use sheets for secondary actions or detailed views.
          </p>
        </div>
        <SheetFooter>
          <Button type="secondary" theme="outline">Cancel</Button>
          <Button type="primary">Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}
