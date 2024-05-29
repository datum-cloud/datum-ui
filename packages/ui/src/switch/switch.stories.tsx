import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from './switch'
import { Button } from '../button/button'

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          'A control that allows the user to toggle between checked and not checked. https://ui.shadcn.com/docs/components/switch',
      },
    },
    backgrounds: { default: 'light' },
  },
  render: ({ ...args }) => {
    return <Switch {...args} />
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {}
