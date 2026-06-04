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
  parameters: {
    docs: {
      description: {
        component:
          'A composable, type-safe data table with client and server modes, sorting, filtering, active filters, pagination, and optional URL state sync.\n\n'
          + 'Built on TanStack React Table. Supports both client-side (`DataTable.Client`) and server-side (`DataTable.Server`) data with sorting, '
          + 'filtering, search, row selection, bulk actions, and pagination. All sub-components are accessed through the `DataTable` namespace. '
          + 'Requires `@tanstack/react-table`; optionally requires `nuqs` for URL state sync.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story:
          'Client-side data table with search and pagination. Pass all options directly to `DataTable.Client` — '
          + 'the provider creates the TanStack table instance internally. Use `pageSize` and `enableRowSelection` controls to explore the defaults.',
      },
    },
  },
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
