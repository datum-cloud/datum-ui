import type { MoreActionsProps } from '@datum-cloud/datum-ui/more-actions'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { MoreActions } from '@datum-cloud/datum-ui/more-actions'
import { CopyIcon, DownloadIcon, PencilIcon, TrashIcon } from 'lucide-react'

const meta: Meta<typeof MoreActions> = {
  title: 'Features/MoreActions',
  component: MoreActions,
  argTypes: {
    actions: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof MoreActions>

export const Default: Story = {
  render: () => {
    const actions: MoreActionsProps<unknown>[] = [
      {
        key: 'edit',
        label: 'Edit',
        action: () => {
          // no-op for story
        },
      },
      {
        key: 'delete',
        label: 'Delete',
        variant: 'destructive',
        action: () => {
          // no-op for story
        },
      },
    ]

    return <MoreActions actions={actions} />
  },
}

export const WithIcons: Story = {
  render: () => {
    const actions: MoreActionsProps<unknown>[] = [
      {
        key: 'edit',
        label: 'Edit',
        icon: <PencilIcon />,
        action: () => {
          // no-op for story
        },
      },
      {
        key: 'duplicate',
        label: 'Duplicate',
        icon: <CopyIcon />,
        action: () => {
          // no-op for story
        },
      },
      {
        key: 'download',
        label: 'Download',
        icon: <DownloadIcon />,
        action: () => {
          // no-op for story
        },
      },
      {
        key: 'delete',
        label: 'Delete',
        variant: 'destructive',
        icon: <TrashIcon />,
        action: () => {
          // no-op for story
        },
      },
    ]

    return <MoreActions actions={actions} />
  },
}
