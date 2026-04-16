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
  render: args => <MoreActions {...args} actions={actions} />,
}
