import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { EmptyContent } from '@datum-cloud/datum-ui/empty-content'

const meta: Meta<typeof EmptyContent> = {
  title: 'Features/EmptyContent',
  component: EmptyContent,
  parameters: {
    docs: {
      description: {
        component:
          'Display a friendly empty state with optional actions when no data is available.\n\n'
          + 'EmptyContent provides a branded empty state placeholder with decorative illustrations, '
          + 'a greeting message, optional subtitle, and action buttons. Use it inside tables, lists, '
          + 'or pages to guide users when there is no data to display.',
      },
    },
  },
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
    spacing: {
      control: 'select',
      options: ['compact', 'normal', 'relaxed'],
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
    spacing: 'normal',
  },
}

export default meta

type Story = StoryObj<typeof EmptyContent>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic usage of the EmptyContent component with a title and the default variant, size, and orientation.',
      },
    },
  },
}

export const WithActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Adds action buttons to the empty state. The `as: \'button\'` variant renders a primary button, '
          + 'while `as: \'link\'` renders an internal navigation link styled as a button.',
      },
    },
  },
  args: {
    actions: [
      { as: 'button', label: 'Create item', type: 'primary' },
      { as: 'link', label: 'Read the docs', to: '/docs' },
    ],
  },
}

export const PersonalizedGreeting: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the `userName` prop to personalize the greeting message. '
          + 'When provided, the component renders "Hey {userName}, ..." instead of the default "Hey there, ...".',
      },
    },
  },
  args: {
    title: 'no results.',
    subtitle: 'Try adjusting your search criteria.',
    userName: 'Alice',
  },
}

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `variant` prop controls border style: `default` uses a solid border, `dashed` uses a dashed border, and `minimal` removes the border entirely.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <EmptyContent title="default border." variant="default" size="sm" />
      <EmptyContent title="dashed border." variant="dashed" size="sm" />
    </div>
  ),
}

export const LinkActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'An action with `as: \'link\'` renders as a button that navigates to an internal route via the `to` prop. '
          + 'Use this for in-app navigation, as distinct from `as: \'external-link\'` which opens in a new tab.',
      },
    },
  },
  args: {
    title: 'no documentation yet.',
    subtitle: undefined,
    actions: [
      { as: 'link', label: 'View Docs', to: '/docs' },
    ],
  },
}

export const ExternalLink: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'An action with `as: \'external-link\'` renders as a button wrapped in an anchor that opens in a new tab '
          + 'with `rel="noopener noreferrer"` applied automatically.',
      },
    },
  },
  args: {
    actions: [
      { as: 'external-link', label: 'Open status page', to: 'https://status.datum.net' },
    ],
  },
}

export const DisabledWithTooltip: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A disabled action paired with a `tooltip` explains why the action is unavailable. '
          + 'This pattern is useful for RBAC — the tooltip is shown on hover even when the button is disabled.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story:
          'Setting `hidden: true` on an action removes it from the rendered output entirely. '
          + 'Only "Visible action" appears; "Hidden action" is suppressed via the RBAC `hidden` flag.',
      },
    },
  },
  args: {
    actions: [
      { as: 'button', label: 'Visible action' },
      { as: 'button', label: 'Hidden action', hidden: true },
    ],
  },
}
