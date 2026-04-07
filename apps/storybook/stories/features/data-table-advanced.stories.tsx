import type { ColumnDef } from '@tanstack/react-table'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import type { User } from '../helpers/mock-data'
import { DataTable } from '@datum-cloud/datum-ui/data-table'
import { useState } from 'react'
import { sampleUsers } from '../helpers/mock-data'

const meta: Meta = {
  title: 'Features/DataTable/Advanced',
}
export default meta
type Story = StoryObj

function AdvancedTableDemo() {
  const [editingRowId, setEditingRowId] = useState<string | null>(null)

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
      id: 'actions',
      cell: ({ row }) => (
        <DataTable.RowActions
          row={row}
          actions={[
            {
              label: 'Edit inline',
              onClick: () => setEditingRowId(row.original.id),
            },
            {
              label: 'View profile',
              onClick: () => alert(`View ${row.original.name}`),
            },
            {
              label: 'Delete',
              variant: 'destructive',
              onClick: () => alert(`Delete ${row.original.name}`),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <DataTable.Client
      data={sampleUsers}
      columns={columns}
      pageSize={6}
      getRowId={row => row.id}
      enableRowSelection
      defaultSort={[{ id: 'name', desc: false }]}
    >
      <div className="flex flex-col gap-4">
        <DataTable.Search placeholder="Search users..." />

        <DataTable.BulkActions>
          {selectedRows => (
            <div className="bg-muted flex items-center gap-3 rounded-lg px-4 py-2 text-sm">
              <span className="font-medium">
                {selectedRows.length}
                {' '}
                selected
              </span>
              <button
                type="button"
                className="rounded-md bg-destructive px-3 py-1 text-xs text-destructive-foreground hover:bg-destructive/90"
                onClick={() => alert(`Delete ${selectedRows.length} users`)}
              >
                Delete Selected
              </button>
              <button
                type="button"
                className="rounded-md bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:bg-secondary/80"
                onClick={() => alert(`Export ${selectedRows.length} users`)}
              >
                Export Selected
              </button>
            </div>
          )}
        </DataTable.BulkActions>

        <DataTable.InlineContent
          position="row"
          rowId={editingRowId ?? undefined}
          open={!!editingRowId}
          onClose={() => setEditingRowId(null)}
        >
          {({ onClose, rowData }) => (
            <div className="flex items-center gap-3 rounded-md border border-dashed border-blue-300 bg-blue-50 p-4">
              <span className="text-sm font-medium">Editing:</span>
              <input
                type="text"
                defaultValue={(rowData as User | null)?.name ?? ''}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              />
              <input
                type="email"
                defaultValue={(rowData as User | null)?.email ?? ''}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              />
              <button
                type="button"
                className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  alert(`Saved changes for ${(rowData as User | null)?.name}`)
                  onClose()
                }}
              >
                Save
              </button>
              <button
                type="button"
                className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-accent"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          )}
        </DataTable.InlineContent>

        <DataTable.Content emptyMessage="No users found." />
        <DataTable.Pagination />
      </div>
    </DataTable.Client>
  )
}

export const Default: Story = {
  render: () => <AdvancedTableDemo />,
}
