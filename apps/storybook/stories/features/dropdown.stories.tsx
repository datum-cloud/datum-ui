import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@datum-cloud/datum-ui/dropdown'
import {
  CopyIcon,
  CreditCardIcon,
  KeyboardIcon,
  LogOutIcon,
  PencilIcon,
  SettingsIcon,
  Trash2Icon,
  UserIcon,
} from 'lucide-react'
import { useState } from 'react'

const meta: Meta<typeof DropdownMenu> = {
  title: 'Features/Dropdown',
  component: DropdownMenu,
  parameters: {
    docs: {
      description: {
        component:
          'A floating menu of actions triggered by a button press.\n\n'
          + 'DropdownMenu displays a list of actions or options in a floating panel, triggered by a button '
          + 'or other interactive element. It is built on Radix UI\'s DropdownMenu primitive and supports '
          + 'items, checkbox items, sub-menus, labels, separators, and keyboard shortcuts. Use '
          + '`DropdownMenuItem` with `variant="destructive"` for danger actions.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof DropdownMenu>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Basic dropdown with a label, separator, icon items, and a destructive log-out action. '
          + 'Trigger is a `secondary` outline button; the menu is anchored below it.',
      },
    },
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="secondary" theme="outline" size="default">
          Open Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCardIcon />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <KeyboardIcon />
          Keyboard shortcuts
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const WithIconsAndShortcuts: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Items can include a leading icon and a trailing `DropdownMenuShortcut` label. '
          + 'The destructive delete item is styled using `variant="destructive"`.',
      },
    },
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="secondary" theme="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <PencilIcon />
          Edit
          <DropdownMenuShortcut>Ctrl+E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon />
          Duplicate
          <DropdownMenuShortcut>Ctrl+D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2Icon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

function CheckboxItemsStory() {
  const [showStatus, setShowStatus] = useState(true)
  const [showTags, setShowTags] = useState(false)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="secondary" theme="outline">Column visibility</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
          Show Status Column
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={showTags} onCheckedChange={setShowTags}>
          Show Tags Column
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const CheckboxItems: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`DropdownMenuCheckboxItem` renders a checkable item that toggles a boolean. '
          + 'Pass `checked` and `onCheckedChange` to control its state.',
      },
    },
  },
  render: () => <CheckboxItemsStory />,
}

export const SubMenu: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`DropdownMenuSub` nests a sub-menu triggered by `DropdownMenuSubTrigger`. '
          + 'The sub-panel opens to the side of the parent item.',
      },
    },
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="secondary" theme="outline">More options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Staging</DropdownMenuItem>
            <DropdownMenuItem>Production</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
