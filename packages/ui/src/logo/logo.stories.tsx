import type { Meta, StoryObj } from "@storybook/react"
import { Logo, logoStyles } from "./logo"

type LogoVariants = keyof typeof logoStyles.variants
const themes = Object.keys(logoStyles.variants.theme) as LogoVariants[]

const meta = {
  title: "Logo",
  component: Logo,
  argTypes: {
    theme: {
      description: "Defines the theme of the logo",
      table: {
        type: { summary: themes.join("|") },
        defaultValue: { summary: "light" },
      },
      control: "select",
      options: themes,
    },
  },
  render: ({ ...args }) => {
    return (<Logo theme={args.theme} width={args.width}/>)
  },
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Light: Story = {
	parameters: {
    backgrounds: { default: 'light' },
  },
  args: {
    theme: "light",
  },
}

export const Dark: Story = {
	parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    theme: "dark",
  },
}

export const Small: Story = {
  args: {
		width: 100
  },
}
