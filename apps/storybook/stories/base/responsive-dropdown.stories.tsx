import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { ResponsiveDropdown } from '@datum-cloud/datum-ui/responsive-dropdown'
import { CreditCardIcon, LogOutIcon, SettingsIcon } from 'lucide-react'
import { useState } from 'react'

/**
 * ResponsiveDropdown renders as a Dropdown at ≥768px and as a MobileSheet at <768px.
 * Resize the Storybook viewport to see the adaptive behaviour.
 *
 * IMPORTANT: children must render in BOTH contexts. Radix `DropdownMenuItem` /
 * `DropdownMenuLabel` require a `DropdownMenu` context that only exists on the
 * desktop branch, so they throw on mobile. Use plain buttons, links, or custom
 * rows that work in either environment.
 */
const meta: Meta<typeof ResponsiveDropdown> = {
  title: 'Base/ResponsiveDropdown',
  component: ResponsiveDropdown,
  parameters: {
    docs: {
      description: {
        component:
          'Renders as a dropdown menu at ≥768px and as a mobile bottom sheet at <768px. The breakpoint is detected via `useBreakpoint`. Resize the viewport to observe the switch.\n\n**Children restriction:** on the mobile branch the children are placed directly inside a `MobileSheet` with no Radix `DropdownMenu` context. Avoid `DropdownMenuItem` / `DropdownMenuLabel` inside `ResponsiveDropdown` — use plain buttons or links instead.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof ResponsiveDropdown>

function MenuRow({
  icon,
  label,
  variant = 'default',
  onSelect,
}: {
  icon: React.ReactNode
  label: string
  variant?: 'default' | 'destructive'
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${
        variant === 'destructive' ? 'text-destructive' : ''
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="flex items-center justify-center p-10">
        <ResponsiveDropdown
          open={open}
          onOpenChange={setOpen}
          sheetTitle="Account"
          trigger={(
            <Button type="secondary" theme="outline">
              My Account
            </Button>
          )}
        >
          <div className="flex flex-col p-1">
            <div className="text-muted-foreground px-3 py-2 text-xs font-semibold">
              My Account
            </div>
            <div className="bg-border -mx-1 my-1 h-px" />
            <MenuRow
              icon={<CreditCardIcon size={14} />}
              label="Billing"
              onSelect={() => setOpen(false)}
            />
            <MenuRow
              icon={<SettingsIcon size={14} />}
              label="Settings"
              onSelect={() => setOpen(false)}
            />
            <div className="bg-border -mx-1 my-1 h-px" />
            <MenuRow
              icon={<LogOutIcon size={14} />}
              label="Log out"
              variant="destructive"
              onSelect={() => setOpen(false)}
            />
          </div>
        </ResponsiveDropdown>
      </div>
    )
  },
}

export const WithCustomContent: Story = {
  name: 'WithCustomContent (rich panel)',
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="flex items-center justify-center p-10">
        <ResponsiveDropdown
          open={open}
          onOpenChange={setOpen}
          sheetTitle="Filters"
          sheetDescription="Refine the visible results"
          contentClassName="w-80 rounded-xl p-4"
          trigger={(
            <Button type="secondary" theme="outline">
              Open filters
            </Button>
          )}
        >
          <div className="space-y-4 p-4 sm:p-0">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">Filter by status</h3>
              <p className="text-muted-foreground text-xs">
                Arbitrary content is allowed here — the component just hands your
                children to a Popover on desktop or a bottom sheet on mobile.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="secondary" theme="outline" size="small">
                Active
              </Button>
              <Button type="secondary" theme="outline" size="small">
                Pending
              </Button>
              <Button type="secondary" theme="outline" size="small">
                Archived
              </Button>
            </div>
          </div>
        </ResponsiveDropdown>
      </div>
    )
  },
}
