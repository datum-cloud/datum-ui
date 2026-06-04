import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Badge } from '@datum-cloud/datum-ui/badge'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

const meta: Meta<typeof Badge> = {
  title: 'Base/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          'A flexible badge component for displaying labels, status indicators, and tags with multiple type and theme variants.\n\n'
          + 'Badge is a lightweight inline element used to display short labels, status indicators, categories, '
          + 'or tags. It supports nine semantic types (`primary`, `secondary`, `tertiary`, `quaternary`, `info`, '
          + '`warning`, `danger`, `success`, `muted`) and three visual themes (`solid`, `outline`, `light`), '
          + 'making it adaptable for status flags, counters, and categorization labels.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'info', 'warning', 'danger', 'success', 'muted'],
    },
    theme: {
      control: 'select',
      options: ['solid', 'outline', 'light'],
    },
  },
  args: {
    type: 'primary',
    theme: 'solid',
    children: 'Badge',
  },
}

export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic usage of the Badge component with the default `primary` type and `solid` theme.',
      },
    },
  },
}

export const Types: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `type` prop controls the semantic color of the badge. Each of the nine types maps to a '
          + 'distinct color defined by design tokens.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge type="primary">Primary</Badge>
      <Badge type="secondary">Secondary</Badge>
      <Badge type="tertiary">Tertiary</Badge>
      <Badge type="quaternary">Quaternary</Badge>
      <Badge type="info">Info</Badge>
      <Badge type="warning">Warning</Badge>
      <Badge type="danger">Danger</Badge>
      <Badge type="success">Success</Badge>
      <Badge type="muted">Muted</Badge>
    </div>
  ),
}

export const Themes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `theme` prop controls the visual style. Choose between `solid` (filled background), '
          + '`outline` (bordered), or `light` (subtle tinted appearance).',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge type="primary" theme="solid">Solid</Badge>
      <Badge type="primary" theme="outline">Outline</Badge>
      <Badge type="primary" theme="light">Light</Badge>
    </div>
  ),
}

export const TypeAndThemeCombinations: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Every type can be combined with every theme. This grid shows combinations across several types.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge type="primary" theme="solid">Primary Solid</Badge>
        <Badge type="primary" theme="outline">Primary Outline</Badge>
        <Badge type="primary" theme="light">Primary Light</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge type="secondary" theme="solid">Secondary Solid</Badge>
        <Badge type="secondary" theme="outline">Secondary Outline</Badge>
        <Badge type="secondary" theme="light">Secondary Light</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge type="success" theme="solid">Success Solid</Badge>
        <Badge type="success" theme="outline">Success Outline</Badge>
        <Badge type="success" theme="light">Success Light</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge type="danger" theme="solid">Danger Solid</Badge>
        <Badge type="danger" theme="outline">Danger Outline</Badge>
        <Badge type="danger" theme="light">Danger Light</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge type="warning" theme="solid">Warning Solid</Badge>
        <Badge type="warning" theme="outline">Warning Outline</Badge>
        <Badge type="warning" theme="light">Warning Light</Badge>
      </div>
    </div>
  ),
}

export const StatusIndicators: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Badges work well as status indicators in lists, tables, or cards using semantic types with the `light` theme.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge type="success" theme="light">Active</Badge>
      <Badge type="warning" theme="light">Pending</Badge>
      <Badge type="danger" theme="light">Failed</Badge>
      <Badge type="info" theme="light">In Progress</Badge>
      <Badge type="muted" theme="light">Archived</Badge>
    </div>
  ),
}

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Since Badge renders as an `inline-flex` element, you can include icons alongside text '
          + 'by adding a `gap` class.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge type="success" theme="light" className="gap-1">
        <CheckCircle className="h-3 w-3" />
        Verified
      </Badge>
      <Badge type="danger" theme="light" className="gap-1">
        <XCircle className="h-3 w-3" />
        Rejected
      </Badge>
      <Badge type="warning" theme="light" className="gap-1">
        <AlertTriangle className="h-3 w-3" />
        Caution
      </Badge>
    </div>
  ),
}

export const CustomStyling: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass additional Tailwind classes via the `className` prop to customize padding, borders, '
          + 'shadows, or any other styling.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge type="primary" className="px-4 py-1">Larger Padding</Badge>
      <Badge type="secondary" theme="outline" className="border-2">Thicker Border</Badge>
      <Badge type="success" className="shadow-md">With Shadow</Badge>
    </div>
  ),
}
