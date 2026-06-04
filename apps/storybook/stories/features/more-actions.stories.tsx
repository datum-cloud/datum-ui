import type { ActionItem } from '@datum-cloud/datum-ui/more-actions'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { MoreActions } from '@datum-cloud/datum-ui/more-actions'
import { CopyIcon, DownloadIcon, PencilIcon, TrashIcon } from 'lucide-react'

const actions: ActionItem<unknown>[] = [
  {
    key: 'edit',
    label: 'Edit',
    icon: <PencilIcon />,
    onClick: () => {},
  },
  {
    key: 'duplicate',
    label: 'Duplicate',
    icon: <CopyIcon />,
    onClick: () => {},
  },
  {
    key: 'download',
    label: 'Download',
    icon: <DownloadIcon />,
    onClick: () => {},
  },
  {
    key: 'delete',
    label: 'Delete',
    variant: 'destructive',
    icon: <TrashIcon />,
    onClick: () => {},
  },
]

const meta: Meta<typeof MoreActions> = {
  title: 'Features/MoreActions',
  component: MoreActions,
  parameters: {
    docs: {
      description: {
        component:
          'A pre-built ellipsis dropdown for row-level or contextual action menus.\n\n'
          + 'MoreActions renders an ellipsis button (`...`) that opens a dropdown of `ActionItem` entries. '
          + 'Each action supports an optional `icon`, a `variant` of `\'default\'` or `\'destructive\'` (red text), '
          + 'and `disabled`/`hidden` as booleans or functions receiving the `row` data. '
          + 'Pass a `tooltip` string or function for additional context on hover. '
          + 'When all actions are hidden the component renders nothing.',
      },
    },
  },
  argTypes: {
    actions: { control: false },
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof MoreActions>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic usage with edit, duplicate, download, and a destructive delete action.',
      },
    },
  },
  render: args => <MoreActions {...args} actions={actions} />,
}

export const WithRowData: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `row` so each action\'s `onClick`, `disabled`, and `hidden` callbacks receive the row data. '
          + 'The delete action is disabled when `isProtected` is true.',
      },
    },
  },
  render: () => {
    const row = { id: 'proj-1', name: 'My Project', isProtected: true }
    const rowActions: ActionItem<typeof row>[] = [
      {
        key: 'view',
        label: 'View Details',
        icon: <PencilIcon />,
        onClick: r => alert(`Viewing ${r.name}`),
      },
      {
        key: 'delete',
        label: 'Delete',
        variant: 'destructive',
        icon: <TrashIcon />,
        onClick: r => alert(`Deleting ${r.name}`),
        disabled: r => r.isProtected,
        tooltip: r => r.isProtected ? 'Protected projects cannot be deleted' : 'Delete project',
      },
    ]
    return <MoreActions row={row} actions={rowActions} />
  },
}

export const ConditionalVisibility: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Actions with `hidden` returning `true` are filtered out before rendering. '
          + 'Here the "Admin Settings" item is hidden for non-admin users — only Edit and Delete appear.',
      },
    },
  },
  render: () => {
    const currentUser = { isAdmin: false }
    const visibilityActions: ActionItem<unknown>[] = [
      { key: 'edit', label: 'Edit', icon: <PencilIcon />, onClick: () => {} },
      {
        key: 'admin-only',
        label: 'Admin Settings',
        icon: <CopyIcon />,
        onClick: () => {},
        hidden: () => !currentUser.isAdmin,
      },
      { key: 'delete', label: 'Delete', variant: 'destructive', icon: <TrashIcon />, onClick: () => {} },
    ]
    return <MoreActions actions={visibilityActions} />
  },
}
