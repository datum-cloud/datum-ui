import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { ResponsivePopover } from '@datum-cloud/datum-ui/responsive-popover'
import { useState } from 'react'

const meta: Meta<typeof ResponsivePopover> = {
  title: 'Base/ResponsivePopover',
  component: ResponsivePopover,
  parameters: {
    docs: {
      description: {
        component:
          'Renders as a popover at ≥768px and a mobile bottom sheet at <768px. Honors InSheetContext — when nested inside another MobileSheet, stays as a popover automatically. Children must be plain React nodes (not Radix DropdownMenu primitives).',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof ResponsivePopover>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="flex items-center justify-center p-10">
        <ResponsivePopover
          open={open}
          onOpenChange={setOpen}
          sheetTitle="Preferences"
          trigger={(
            <Button type="secondary" theme="outline">
              Open preferences
            </Button>
          )}
        >
          <div className="space-y-3 p-4">
            <h3 className="text-sm font-semibold">Theme</h3>
            <p className="text-muted-foreground text-xs">
              Arbitrary content renders here. On desktop this is a Popover; on mobile a MobileSheet.
            </p>
            <div className="flex gap-2">
              <Button type="secondary" theme="outline" size="small">Light</Button>
              <Button type="secondary" theme="outline" size="small">Dark</Button>
              <Button type="secondary" theme="outline" size="small">Auto</Button>
            </div>
          </div>
        </ResponsivePopover>
      </div>
    )
  },
}

export const ResponsiveFalse: Story = {
  name: 'ResponsiveFalse (stays popover on mobile)',
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="flex items-center justify-center p-10">
        <ResponsivePopover
          open={open}
          onOpenChange={setOpen}
          sheetTitle="Preferences"
          responsive={false}
          trigger={(
            <Button type="secondary" theme="outline">
              Open (always popover)
            </Button>
          )}
        >
          <div className="space-y-2 p-4">
            <p className="text-muted-foreground text-xs">
              <code>responsive=&#123;false&#125;</code>
              {' '}
              keeps this as a popover even at mobile widths.
            </p>
          </div>
        </ResponsivePopover>
      </div>
    )
  },
}
