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

export const LongDescription: Story = {
  args: {
    title: 'Network Policies',
    description:
      'Configure and manage network policies that control traffic between services in your cluster. Policies define ingress and egress rules based on pod selectors, namespace selectors, and IP blocks, giving you fine-grained control over east-west communication within your infrastructure.',
  },
  render: args => (
    <div className="space-y-2">
      <PageTitle
        {...args}
        actions={(
          <Button type="primary" icon={<Plus size={16} />}>
            New Policy
          </Button>
        )}
      />
      <p className="text-muted-foreground text-xs">
        The title uses the
        {' '}
        <code>font-title</code>
        {' '}
        utility (see
        {' '}
        <code>@datum-cloud/datum-ui/styles/canela</code>
        ). The description is
        constrained to
        <code>max-w-2xl</code>
        {' '}
        to keep long text readable.
      </p>
    </div>
  ),
}
