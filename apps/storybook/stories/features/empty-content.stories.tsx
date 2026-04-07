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
