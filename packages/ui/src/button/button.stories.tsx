import type { Meta, StoryObj } from '@storybook/react'
import { ArrowUpRight } from 'lucide-react'
import { Button, buttonStyles } from './button'

type ButtonVariants = keyof typeof buttonStyles.variants
const variants = Object.keys(buttonStyles.variants.variant) as ButtonVariants[]

const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Reusable logo component with full and icon-only variants. Please always use this component rather than importing an SVG',
      },
    },
  },
  argTypes: {
    variant: {
      description: 'Defines the theme of the logo',
      table: {
        type: { summary: variants.join('|') },
        defaultValue: { summary: 'light' },
      },
      control: 'select',
      options: variants,
    },
    children: {
      description: 'Button text',
      control: 'text',
      defaultValue: 'Button',
    },
  },
  render: ({ children, ...args }) => {
    return <Button {...args}>{children}</Button>
  },
} satisfies Meta<typeof Button>

export default meta
meta.args = {
  children: 'Button text',
}
type Story = StoryObj<typeof meta>

export const sunglow: Story = {
  args: {
    variant: 'sunglow',
  },
}

export const WithIcon: Story = {
  args: {
    icon: <ArrowUpRight />,
  },
}

export const IconPositionLeft: Story = {
  args: {
    icon: <ArrowUpRight />,
    iconPosition: 'left',
  },
}
