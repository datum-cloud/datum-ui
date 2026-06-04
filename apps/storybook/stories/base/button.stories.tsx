import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { Mail, Plus, Search, Settings, Trash2 } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'Base/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Trigger actions and events with configurable types, themes, sizes, and states.\n\n'
          + 'The Button component supports multiple visual types (`primary`, `secondary`, `tertiary`, '
          + '`quaternary`, `danger`, `warning`, `success`) combined with themes (`solid`, `outline`, '
          + '`light`, `borderless`, `link`) for flexible styling. It includes loading states, icon '
          + 'support, and full-width layout.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'warning', 'danger', 'success'],
    },
    theme: {
      control: 'select',
      options: ['solid', 'light', 'outline', 'borderless', 'link'],
    },
    size: {
      control: 'select',
      options: ['xs', 'small', 'default', 'large', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    block: {
      control: 'boolean',
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
    },
    icon: {
      control: 'select',
      options: ['none', 'mail', 'plus', 'trash', 'settings', 'search'],
      mapping: {
        none: undefined,
        mail: <Mail size={16} />,
        plus: <Plus size={16} />,
        trash: <Trash2 size={16} />,
        settings: <Settings size={16} />,
        search: <Search size={16} />,
      },
    },
  },
  args: {
    type: 'primary',
    theme: 'solid',
    size: 'default',
    disabled: false,
    loading: false,
    block: false,
    iconPosition: 'left',
    children: 'Button',
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic usage of the Button component with the default `primary` type and `solid` theme.',
      },
    },
  },
}

export const Types: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The Button supports seven semantic `type` values that map to distinct color palettes: `primary`, `secondary`, `tertiary`, `quaternary`, `danger`, `warning`, and `success`.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button type="primary" theme="solid">Primary</Button>
      <Button type="secondary" theme="solid">Secondary</Button>
      <Button type="tertiary" theme="solid">Tertiary</Button>
      <Button type="quaternary" theme="solid">Quaternary</Button>
      <Button type="danger" theme="solid">Danger</Button>
      <Button type="warning" theme="solid">Warning</Button>
      <Button type="success" theme="solid">Success</Button>
    </div>
  ),
}

export const Themes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Each type can be paired with a visual `theme`: `solid`, `outline`, `light`, `borderless`, or `link`. The example below shows all five themes applied to the `primary` type.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button type="primary" theme="solid">Solid</Button>
      <Button type="primary" theme="outline">Outline</Button>
      <Button type="primary" theme="light">Light</Button>
      <Button type="primary" theme="borderless">Borderless</Button>
      <Button type="primary" theme="link">Link</Button>
    </div>
  ),
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the `size` prop to control button height and padding. Available sizes are `xs`, `small`, `default`, `large`, and `icon` (produces a square button sized for a single icon).',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      <Button type="primary" theme="solid" size="xs">Extra Small</Button>
      <Button type="primary" theme="solid" size="small">Small</Button>
      <Button type="primary" theme="solid" size="default">Default</Button>
      <Button type="primary" theme="solid" size="large">Large</Button>
    </div>
  ),
}

export const LoadingState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `loading` to `true` to show a spinner and prevent interaction while an async operation is in progress.',
      },
    },
  },
  render: () => (
    <div className="flex gap-2">
      <Button type="primary" theme="solid" loading>Loading</Button>
      <Button type="primary" theme="outline" loading>Processing</Button>
    </div>
  ),
}

export const FullWidth: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set `block` to `true` to make the button expand to the full width of its container.',
      },
    },
  },
  render: () => (
    <div className="w-full max-w-sm">
      <Button type="primary" theme="solid" block>Full Width</Button>
    </div>
  ),
}
