import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { Sheet } from '@datum-cloud/datum-ui/sheet'

const meta: Meta = {
  title: 'Base/Sheet',
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
  args: {
    side: 'right',
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: args => (
    <Sheet>
      <Sheet.Trigger asChild>
        <Button type="primary" theme="solid" size="default">
          Open Sheet
        </Button>
      </Sheet.Trigger>
      <Sheet.Content side={(args as { side?: 'top' | 'right' | 'bottom' | 'left' }).side}>
        <Sheet.Header>
          <Sheet.Title>Sheet Title</Sheet.Title>
          <Sheet.Description>
            This is a sheet panel that slides in from the side.
          </Sheet.Description>
        </Sheet.Header>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            Sheet content goes here. Use sheets for secondary actions, filters,
            or detailed views that do not require a full page.
          </p>
        </div>
        <Sheet.Footer>
          <Button type="secondary" theme="outline" size="default">
            Cancel
          </Button>
          <Button type="primary" theme="solid" size="default">
            Save
          </Button>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  ),
}

export const AllSides: Story = {
  render: () => {
    const sides = ['top', 'right', 'bottom', 'left'] as const

    return (
      <div className="flex flex-wrap gap-4">
        {sides.map(side => (
          <Sheet key={side}>
            <Sheet.Trigger asChild>
              <Button type="secondary" theme="outline" size="default">
                Open
                {' '}
                {side}
              </Button>
            </Sheet.Trigger>
            <Sheet.Content side={side}>
              <Sheet.Header>
                <Sheet.Title className="capitalize">
                  {side}
                  {' '}
                  Sheet
                </Sheet.Title>
                <Sheet.Description>
                  This sheet slides in from the
                  {' '}
                  {side}
                  .
                </Sheet.Description>
              </Sheet.Header>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  Content for the
                  {' '}
                  {side}
                  {' '}
                  sheet.
                </p>
              </div>
            </Sheet.Content>
          </Sheet>
        ))}
      </div>
    )
  },
}
