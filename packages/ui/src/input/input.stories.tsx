import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input'

const meta: Meta<typeof Input> = {
  title: 'Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          'Form input component: https://ui.shadcn.com/docs/components/input',
      },
    },
    backgrounds: { default: 'white' },
  },
  render: ({ children, ...args }) => {
    return <Input {...args}>{children}</Input>
  },
} satisfies Meta<typeof Input>

export default meta
meta.args = {
  placeholder: 'Email',
  type: 'email',
}
type Story = StoryObj<typeof meta>

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Email',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
