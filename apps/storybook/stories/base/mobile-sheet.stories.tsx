import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { MobileSheet } from '@datum-cloud/datum-ui/mobile-sheet'
import { useState } from 'react'

/**
 * MobileSheet is designed for narrow (mobile) viewports.
 * In Storybook it renders at all widths since MobileSheet is viewport-agnostic —
 * the consumer decides when to show it (e.g. via a breakpoint check).
 */
const meta: Meta<typeof MobileSheet> = {
  title: 'Base/MobileSheet',
  component: MobileSheet,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    title: 'Options',
    description: undefined,
  },
}

export default meta

type Story = StoryObj<typeof MobileSheet>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open Sheet
        </Button>
        <MobileSheet
          {...args}
          open={open}
          onOpenChange={setOpen}
          footer={(
            <div className="flex justify-end gap-2">
              <Button type="secondary" theme="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          )}
        >
          <div className="space-y-2 px-4 py-3">
            <p className="text-sm">This is the body content of the mobile sheet.</p>
            <p className="text-muted-foreground text-xs">
              Scroll-overflow is handled automatically when content is tall.
            </p>
          </div>
        </MobileSheet>
      </>
    )
  },
}

export const WithDescription: Story = {
  args: {
    title: 'Sort & Filter',
    description: 'Adjust how results are displayed.',
  },
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button type="secondary" theme="outline" onClick={() => setOpen(true)}>
          Open with Description
        </Button>
        <MobileSheet
          {...args}
          open={open}
          onOpenChange={setOpen}
          footer={(
            <div className="flex justify-end gap-2">
              <Button type="secondary" theme="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button type="primary" onClick={() => setOpen(false)}>
                Apply
              </Button>
            </div>
          )}
        >
          <div className="px-4 py-3">
            <p className="text-sm">Filter options would appear here.</p>
          </div>
        </MobileSheet>
      </>
    )
  },
}

export const NoFooter: Story = {
  args: {
    title: 'Information',
  },
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button type="secondary" theme="outline" onClick={() => setOpen(true)}>
          Open (No Footer)
        </Button>
        <MobileSheet {...args} open={open} onOpenChange={setOpen}>
          <div className="px-4 py-3">
            <p className="text-sm">
              This sheet has no footer. The user dismisses it by swiping or tapping outside.
            </p>
          </div>
        </MobileSheet>
      </>
    )
  },
}
