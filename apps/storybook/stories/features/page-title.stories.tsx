import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { PageTitle } from '@datum-cloud/datum-ui/page-title'
import { Plus } from 'lucide-react'

const meta: Meta<typeof PageTitle> = {
  title: 'Features/PageTitle',
  component: PageTitle,
  argTypes: {
    title: {
      control: { type: 'text' },
    },
    description: {
      control: { type: 'text' },
    },
    actionsPosition: {
      control: { type: 'select' },
      options: ['inline', 'bottom'],
    },
  },
  args: {
    title: 'Dashboard',
    actionsPosition: 'inline',
  },
}

export default meta

type Story = StoryObj<typeof PageTitle>

export const Default: Story = {
  args: {
    title: 'Dashboard',
  },
}

export const WithDescription: Story = {
  args: {
    title: 'Team Members',
    description: 'Manage your team members and their roles.',
  },
}

export const WithActions: Story = {
  render: () => (
    <PageTitle
      title="Projects"
      description="View and manage all your projects."
      actions={(
        <Button type="primary" icon={<Plus size={16} />}>
          New Project
        </Button>
      )}
    />
  ),
}
