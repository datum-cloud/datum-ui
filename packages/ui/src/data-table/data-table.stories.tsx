import type { Meta, StoryObj } from '@storybook/react'
import { DataTable } from './data-table'
import { columns, mockData } from './mocks/data-table.mock'

const meta: Meta<typeof DataTable> = {
  title: 'UI/DataTable',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component:
          'A data table component',
      },
    },
  },
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className='p-8 bg-white rounded-lg'>
      <DataTable columns={columns} data={mockData} />
    </div>
  ),
}
