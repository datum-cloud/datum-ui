import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { PageTitle } from '@datum-cloud/datum-ui/page-title'
import { Plus } from 'lucide-react'

const meta: Meta<typeof PageTitle> = {
  title: 'Features/PageTitle',
  component: PageTitle,
  parameters: {
    docs: {
      description: {
        component:
          'A page heading component with optional description and action buttons in inline or stacked layouts.\n\n'
          + 'PageTitle renders a page heading with optional `description` text and an `actions` area. '
          + 'Actions can be positioned inline (side by side with the title, the default) or stacked '
          + 'below the title and description with `actionsPosition="bottom"`. '
          + 'Use `titleClassName`, `descriptionClassName`, and `actionsClassName` for targeted style overrides.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Basic usage with a title, description, and an inline action button.',
      },
    },
  },
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

export const WithDescription: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Title with a description and no actions.',
      },
    },
  },
  args: {
    title: 'Team Members',
    description: 'Manage your team members and their roles.',
    actionsPosition: 'inline',
  },
}

export const WithActionsBottom: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set `actionsPosition="bottom"` to stack the actions below the title and description.',
      },
    },
  },
  args: {
    title: 'Account Settings',
    description: 'Update your account preferences and security settings.',
    actionsPosition: 'bottom',
  },
  render: args => (
    <PageTitle
      {...args}
      actions={(
        <div className="flex gap-2">
          <Button type="secondary" theme="outline">Cancel</Button>
          <Button type="primary" theme="solid">Save Changes</Button>
        </div>
      )}
    />
  ),
}

export const CustomStyling: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `titleClassName`, `descriptionClassName`, and `className` to override individual sections.',
      },
    },
  },
  args: {
    title: 'Styled Title',
    description: 'With custom colors and sizing.',
    titleClassName: 'text-3xl text-blue-600',
    descriptionClassName: 'text-base text-blue-400',
    className: 'border-b pb-4',
  },
}

export const LongDescription: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The description is constrained to `max-w-2xl` to keep long text readable.',
      },
    },
  },
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
