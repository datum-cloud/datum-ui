import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { EmptyContent } from '@datum-cloud/datum-ui/empty-content'

const meta: Meta<typeof EmptyContent> = {
  title: 'Features/EmptyContent',
  component: EmptyContent,
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    userName: { control: 'text' },
    variant: {
      control: 'select',
      options: ['default', 'dashed', 'minimal'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    actions: { control: false },
    linkComponent: { control: false },
  },
  args: {
    title: 'no items yet.',
    subtitle: 'Get started by creating your first item.',
    userName: 'there',
    variant: 'default',
    size: 'md',
    orientation: 'vertical',
  },
}

export default meta

type Story = StoryObj<typeof EmptyContent>

export const Default: Story = {}

export const WithActions: Story = {
  args: {
    actions: [
      { as: 'button', label: 'Create item', type: 'primary' },
      { as: 'link', label: 'Read the docs', to: '/docs' },
    ],
  },
}

export const ExternalLink: Story = {
  args: {
    actions: [
      { as: 'external-link', label: 'Open status page', to: 'https://status.datum.net' },
    ],
  },
}

export const DisabledWithTooltip: Story = {
  args: {
    actions: [
      {
        as: 'button',
        label: 'Create item',
        disabled: true,
        tooltip: 'You don\'t have permission to create items.',
      },
    ],
  },
}

export const HiddenAction: Story = {
  args: {
    actions: [
      { as: 'button', label: 'Visible action' },
      { as: 'button', label: 'Hidden action', hidden: true },
    ],
  },
}
