import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { Mail, Plus, Search, Settings, Trash2 } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'Base/Button',
  component: Button,
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'warning', 'danger', 'success'],
    },
    theme: {
      control: 'select',
      options: ['solid', 'light', 'outline', 'borderless'],
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

export const Default: Story = {}
