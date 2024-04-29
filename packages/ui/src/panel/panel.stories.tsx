import type { Meta, StoryObj } from '@storybook/react'
import { Panel } from './panel'

const meta: Meta<typeof Panel> = {
  title: 'Panel',
  component: Panel,
  parameters: {
    docs: {
      description: {
        component: 'Display panel',
      },
    },
    backgrounds: { default: 'white' },
  },

  render: (args) => {
    return (
      <Panel {...args}>
        <>{args.children}</>
      </Panel>
    )
  },
} satisfies Meta<typeof Panel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Panel contents',
  },
}

export const NoPadding: Story = {
  args: {
    children: 'Panel contents',
    noPadding: true,
  },
}
