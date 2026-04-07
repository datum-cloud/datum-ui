import type { ColumnDef } from '@tanstack/react-table'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import type { User } from '../helpers/mock-data'
import { DataTable } from '@datum-cloud/datum-ui/data-table'
import { roleOptions, sampleUsers, statusOptions } from '../helpers/mock-data'

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
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTable.ColumnHeader column={column} title="Created" />,
  },
]

const meta: Meta = {
  title: 'Features/DataTable/Filters',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <DataTable.Client
      data={sampleUsers}
      columns={columns}
      pageSize={6}
      getRowId={row => row.id}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <DataTable.Search placeholder="Search users..." />
          <DataTable.SelectFilter
            column="status"
            label="Status"
            options={statusOptions}
          />
          <DataTable.CheckboxFilter
            column="role"
            label="Roles"
            options={roleOptions}
          />
          <DataTable.DatePickerFilter
            column="createdAt"
            label="Created after"
          />
        </div>
        <DataTable.ActiveFilters
          filterLabels={{ role: 'Roles', status: 'Status', createdAt: 'Created after' }}
        />
        <DataTable.Content emptyMessage="No users found." />
        <DataTable.Pagination />
      </div>
    </DataTable.Client>
  ),
}
