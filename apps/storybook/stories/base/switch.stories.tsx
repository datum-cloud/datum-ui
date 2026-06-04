import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Label } from '@datum-cloud/datum-ui/label'
import { Switch } from '@datum-cloud/datum-ui/switch'

const meta: Meta<typeof Switch> = {
  title: 'Base/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          'A toggle control for binary on/off states, built on Radix UI Switch.\n\n'
          + 'The Switch component provides a visual toggle for boolean settings styled with Datum design tokens. '
          + 'It supports controlled (`checked` + `onCheckedChange`) and uncontrolled (`defaultChecked`) usage, '
          + 'and integrates with HTML forms via `name` and `value` props.',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
  },
  args: {
    disabled: false,
    defaultChecked: false,
  },
}

export default meta

type Story = StoryObj<typeof Switch>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic usage of the Switch component paired with a Label.',
      },
    },
  },
  render: args => (
    <div className="flex items-center gap-2">
      <Switch id="airplane-mode" {...args} />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
}

export const CheckedByDefault: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pass `defaultChecked` to start the switch in the on position (uncontrolled).',
      },
    },
  },
  render: () => <Switch defaultChecked />,
}

export const WithLabel: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pair the Switch with a Label using matching `id` and `htmlFor` attributes for accessibility.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notifications" />
      <Label htmlFor="notifications">Enable notifications</Label>
    </div>
  ),
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set `disabled` to prevent interaction and render the switch in a visually muted state.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <Switch disabled />
      <Switch disabled defaultChecked />
    </div>
  ),
}
