import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { EmptyContent } from '@datum-cloud/datum-ui/empty-content'
import { Plus } from 'lucide-react'

const meta: Meta<typeof EmptyContent> = {
  title: 'Features/EmptyContent',
  component: EmptyContent,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'dashed', 'minimal'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    orientation: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
    },
    title: {
      control: { type: 'text' },
    },
    subtitle: {
      control: { type: 'text' },
    },
    userName: {
      control: { type: 'text' },
    },
    actions: { control: false },
    linkComponent: { control: false },
  },
  args: {
    variant: 'default',
    size: 'md',
    orientation: 'vertical',
    title: 'no items yet.',
    userName: 'there',
  },
}

export default meta

type Story = StoryObj<typeof EmptyContent>

export const Default: Story = {
  args: {
    title: 'no items yet.',
  },
}

export const WithAction: Story = {
  args: {
    title: 'no projects found.',
    subtitle: 'Create your first project to get started.',
    actions: [
      {
        type: 'button',
        label: 'Create Project',
        onClick: () => console.log('Create clicked'),
        variant: 'default',
        icon: <Plus size={14} />,
      },
    ],
  },
}

export const WithIcon: Story = {
  args: {
    title: 'no results.',
    subtitle: 'Try adjusting your search criteria.',
    variant: 'dashed',
    size: 'lg',
  },
}
