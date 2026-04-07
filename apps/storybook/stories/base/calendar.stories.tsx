import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Calendar } from '@datum-cloud/datum-ui/calendar'

const meta: Meta<typeof Calendar> = {
  title: 'Base/Calendar',
  component: Calendar,
  argTypes: {
    showOutsideDays: {
      control: 'boolean',
    },
    numberOfMonths: {
      control: 'number',
    },
  },
  args: {
    showOutsideDays: true,
    numberOfMonths: 1,
  },
}

export default meta

type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  render: args => <Calendar {...args} />,
}
