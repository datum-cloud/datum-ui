import type { ColumnDef } from '@tanstack/react-table'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import type { User } from '../helpers/mock-data'
import { DataTable } from '@datum-cloud/datum-ui/data-table'
import { sampleUsers } from '../helpers/mock-data'

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTable.ColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTable.ColumnHeader column={column} title="Email" />,
  },
  { accessorKey: 'role', header: 'Role' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
          row.original.status === 'active'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
]

interface DataTableStoryArgs {
  pageSize: number
  enableRowSelection: boolean
}

const meta: Meta<DataTableStoryArgs> = {
  title: 'Features/DataTable',
  argTypes: {
    pageSize: { control: { type: 'number', min: 1, max: 20 } },
    enableRowSelection: { control: 'boolean' },
  },
  args: {
    pageSize: 5,
    enableRowSelection: false,
  },
}
export default meta
type Story = StoryObj<DataTableStoryArgs>

export const Default: Story = {
  render: args => (
    <DataTable.Client
      data={sampleUsers}
      columns={columns}
      pageSize={args.pageSize}
      enableRowSelection={args.enableRowSelection}
      getRowId={row => row.id}
    >
      <div className="flex flex-col gap-4">
        <DataTable.Search placeholder="Search users..." />
        <DataTable.Content emptyMessage="No users found." />
        <DataTable.Pagination />
      </div>
    </DataTable.Client>
  ),
}
