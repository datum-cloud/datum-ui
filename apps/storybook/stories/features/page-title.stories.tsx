import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { PageTitle } from '@datum-cloud/datum-ui/page-title'
import { Plus } from 'lucide-react'

const meta: Meta<typeof PageTitle> = {
  title: 'Features/PageTitle',
  component: PageTitle,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    actionsPosition: {
      control: 'select',
      options: ['inline', 'bottom'],
    },
    actions: { control: false },
  },
  args: {
    title: 'Dashboard',
    description: 'Manage your resources and configurations.',
    actionsPosition: 'inline',
  },
}

export default meta

type Story = StoryObj<typeof PageTitle>

export const Default: Story = {
  render: args => (
    <PageTitle
      {...args}
      actions={(
        <Button type="primary" icon={<Plus size={16} />}>
          New Item
        </Button>
      )}
    />
  ),
}
