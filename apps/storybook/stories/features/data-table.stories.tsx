import type { ColumnDef } from '@tanstack/react-table'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  DataTable,
  useDataTableLoading,
} from '@datum-cloud/datum-ui/data-table'
import { useState } from 'react'

const meta: Meta = {
  title: 'Features/DataTable',
}

export default meta

type Story = StoryObj

// ---------------------------------------------------------------------------
// Shared types and sample data
// ---------------------------------------------------------------------------

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: string
}

const sampleUsers: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'active', createdAt: '2024-02-20' },
  { id: '3', name: 'Carol Williams', email: 'carol@example.com', role: 'Viewer', status: 'inactive', createdAt: '2024-03-10' },
  { id: '4', name: 'Dave Brown', email: 'dave@example.com', role: 'Editor', status: 'active', createdAt: '2024-04-05' },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'active', createdAt: '2024-05-12' },
  { id: '6', name: 'Frank Miller', email: 'frank@example.com', role: 'Viewer', status: 'inactive', createdAt: '2024-06-18' },
  { id: '7', name: 'Grace Wilson', email: 'grace@example.com', role: 'Editor', status: 'active', createdAt: '2024-07-22' },
  { id: '8', name: 'Hank Moore', email: 'hank@example.com', role: 'Viewer', status: 'active', createdAt: '2024-08-30' },
  { id: '9', name: 'Ivy Taylor', email: 'ivy@example.com', role: 'Admin', status: 'inactive', createdAt: '2024-09-14' },
  { id: '10', name: 'Jack Anderson', email: 'jack@example.com', role: 'Editor', status: 'active', createdAt: '2024-10-01' },
  { id: '11', name: 'Kate Thomas', email: 'kate@example.com', role: 'Viewer', status: 'active', createdAt: '2024-10-15' },
  { id: '12', name: 'Leo Jackson', email: 'leo@example.com', role: 'Admin', status: 'active', createdAt: '2024-11-01' },
]

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
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
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Created" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTable.RowActions
        row={row}
        actions={[
          { label: 'View profile', onClick: () => alert(`View ${row.original.name}`) },
          { label: 'Edit', onClick: () => alert(`Edit ${row.original.name}`) },
          { label: 'Delete', variant: 'destructive', onClick: () => alert(`Delete ${row.original.name}`) },
        ]}
      />
    ),
  },
]

// ---------------------------------------------------------------------------
// Client DataTable -- full-featured with filters, search, pagination
// ---------------------------------------------------------------------------

function ClientTableDemo() {
  return (
    <DataTable.Client
      data={sampleUsers}
      columns={columns}
      pageSize={5}
      getRowId={row => row.id}
      enableRowSelection
      defaultSort={[{ id: 'name', desc: false }]}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <DataTable.Search placeholder="Search users..." />
          <DataTable.SelectFilter
            column="role"
            label="Role"
            options={[
              { label: 'Admin', value: 'Admin' },
              { label: 'Editor', value: 'Editor' },
              { label: 'Viewer', value: 'Viewer' },
            ]}
          />
          <DataTable.SelectFilter
            column="status"
            label="Status"
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
          />
        </div>
        <DataTable.ActiveFilters
          filterLabels={{ role: 'Role', status: 'Status' }}
        />
        <DataTable.BulkActions>
          {selectedRows => (
            <div className="bg-muted flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
              <span>
                {selectedRows.length}
                {' '}
                selected
              </span>
              <button
                type="button"
                className="text-destructive text-sm underline"
                onClick={() => alert(`Delete ${selectedRows.length} users`)}
              >
                Delete selected
              </button>
            </div>
          )}
        </DataTable.BulkActions>
        <DataTable.Content emptyMessage="No users found." />
        <DataTable.Pagination />
      </div>
    </DataTable.Client>
  )
}

export const ClientTable: Story = {
  render: () => <ClientTableDemo />,
}

// ---------------------------------------------------------------------------
// Server DataTable -- fetches from JSONPlaceholder API
// ---------------------------------------------------------------------------

interface Post {
  userId: number
  id: number
  title: string
  body: string
}

const postColumns: ColumnDef<Post>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="ID" />
    ),
    size: 80,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTable.ColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: 'body',
    header: 'Body',
    cell: ({ row }) => (
      <span className="line-clamp-1 max-w-md">{row.original.body}</span>
    ),
  },
  {
    accessorKey: 'userId',
    header: 'Author',
    cell: ({ row }) => (
      <span>
        User
        {row.original.userId}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTable.RowActions
        row={row}
        actions={[
          { label: 'View', onClick: () => alert(`Post #${row.original.id}: ${row.original.title}`) },
          { label: 'Delete', variant: 'destructive', onClick: () => alert(`Delete post #${row.original.id}`) },
        ]}
      />
    ),
  },
]

function ServerTableContent() {
  const { isLoading } = useDataTableLoading()
  return (
    <div className="flex flex-col gap-4">
      <DataTable.Search placeholder="Search posts..." />
      <DataTable.ActiveFilters />
      {isLoading
        ? <DataTable.Loading rows={5} columns={4} />
        : <DataTable.Content emptyMessage="No posts found." />}
      <DataTable.Pagination />
    </div>
  )
}

function ServerTableDemo() {
  return (
    <DataTable.Server
      columns={postColumns}
      limit={10}
      getRowId={(row: Post) => String(row.id)}
      fetchFn={async (args) => {
        const start = args.cursor ? Number(args.cursor) : 0
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${args.limit}`,
        )
        return res.json()
      }}
      transform={(posts: Post[]) => {
        const start = posts.length > 0 ? (posts[0]?.id ?? 1) - 1 : 0
        const nextStart = start + posts.length
        return {
          data: posts,
          cursor: nextStart < 100 ? String(nextStart) : undefined,
          hasNextPage: posts.length === 10 && nextStart < 100,
        }
      }}
    >
      <ServerTableContent />
    </DataTable.Server>
  )
}

export const ServerTable: Story = {
  render: () => <ServerTableDemo />,
}

// ---------------------------------------------------------------------------
// Minimal -- simplest possible usage
// ---------------------------------------------------------------------------

function MinimalDemo() {
  return (
    <DataTable.Client
      data={sampleUsers.slice(0, 5)}
      columns={columns.filter(c => 'accessorKey' in c && c.accessorKey !== 'createdAt')}
    >
      <DataTable.Content />
    </DataTable.Client>
  )
}

export const Minimal: Story = {
  render: () => <MinimalDemo />,
}

// ---------------------------------------------------------------------------
// With Checkbox Filters
// ---------------------------------------------------------------------------

function CheckboxFilterDemo() {
  return (
    <DataTable.Client data={sampleUsers} columns={columns} pageSize={6}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <DataTable.Search placeholder="Search..." />
          <DataTable.CheckboxFilter
            column="role"
            label="Roles"
            options={[
              { label: 'Admin', value: 'Admin' },
              { label: 'Editor', value: 'Editor' },
              { label: 'Viewer', value: 'Viewer' },
            ]}
          />
          <DataTable.DatePickerFilter
            column="createdAt"
            label="Created after"
          />
        </div>
        <DataTable.Content />
        <DataTable.Pagination />
      </div>
    </DataTable.Client>
  )
}

export const WithCheckboxFilters: Story = {
  render: () => <CheckboxFilterDemo />,
}

// ---------------------------------------------------------------------------
// Multi-Select with Bulk Actions
// ---------------------------------------------------------------------------

function MultiSelectBulkActionsDemo() {
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
        <div className="flex flex-wrap items-center gap-3">
          <DataTable.Search placeholder="Search users..." />
          <DataTable.CheckboxFilter
            column="role"
            label="Roles"
            options={[
              { label: 'Admin', value: 'Admin' },
              { label: 'Editor', value: 'Editor' },
              { label: 'Viewer', value: 'Viewer' },
            ]}
          />
          <DataTable.SelectFilter
            column="status"
            label="Status"
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
          />
        </div>
        <DataTable.ActiveFilters
          filterLabels={{ role: 'Roles', status: 'Status' }}
        />
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
        <DataTable.Content emptyMessage="No users found." />
        <DataTable.Pagination />
      </div>
    </DataTable.Client>
  )
}

export const MultiSelectBulkActions: Story = {
  render: () => <MultiSelectBulkActionsDemo />,
}

// ---------------------------------------------------------------------------
// Custom Styling -- demonstrates className props and data-slot CSS targeting
// ---------------------------------------------------------------------------

function CustomStylingDemo() {
  return (
    <DataTable.Client
      data={sampleUsers}
      columns={columns.filter(c => !('id' in c && c.id === 'actions'))}
      pageSize={6}
      getRowId={row => row.id}
    >
      <div className="flex flex-col gap-4">
        {/* Inline styles targeting data-slot attributes */}
        <style>
          {`
          .custom-dt [data-slot="dt-header"] {
            background-color: #1e293b;
            color: #f8fafc;
          }
          .custom-dt [data-slot="dt-header-cell"] {
            padding: 12px 16px;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            font-size: 0.75rem;
          }
          .custom-dt [data-slot="dt-row"]:hover {
            background-color: #f1f5f9;
          }
          .custom-dt [data-slot="dt-row"][data-state="selected"] {
            background-color: #dbeafe;
          }
          .custom-dt [data-slot="dt-cell"] {
            padding: 10px 16px;
          }
          .custom-dt [data-slot="dt-pagination"] {
            border-top: 2px solid #e2e8f0;
            padding-top: 12px;
          }
        `}
        </style>
        <div className="flex flex-wrap items-center gap-3">
          <DataTable.Search
            placeholder="Custom search..."
            className="border-2 border-blue-300 rounded-lg focus:border-blue-500"
          />
          <DataTable.SelectFilter
            column="role"
            label="Role"
            options={[
              { label: 'Admin', value: 'Admin' },
              { label: 'Editor', value: 'Editor' },
              { label: 'Viewer', value: 'Viewer' },
            ]}
            className="border-2 border-blue-300"
          />
        </div>
        <DataTable.Content
          className="custom-dt rounded-lg border-2 border-slate-300 overflow-hidden"
          tableClassName="border-collapse"
          headerClassName="bg-slate-800 text-white"
          headerRowClassName="border-b-2 border-slate-600"
          headerCellClassName="text-slate-100 uppercase text-xs tracking-wider"
          bodyClassName="divide-y divide-slate-200"
          rowClassName="transition-colors duration-150"
          cellClassName="py-3 px-4"
          emptyMessage="No data available."
        />
        <DataTable.Pagination className="pt-3 border-t-2 border-slate-300" />
      </div>
    </DataTable.Client>
  )
}

export const CustomStyling: Story = {
  render: () => <CustomStylingDemo />,
}

// ---------------------------------------------------------------------------
// Inline Content -- create form (top) and edit form (row)
// ---------------------------------------------------------------------------

function InlineContentDemo() {
  const [isCreating, setIsCreating] = useState(false)
  const [editingRowId, setEditingRowId] = useState<string | null>(null)

  const inlineColumns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTable.ColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTable.ColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
    {
      accessorKey: 'status',
      header: 'Status',
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
      columns={inlineColumns}
      pageSize={6}
      getRowId={row => row.id}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <DataTable.Search placeholder="Search users..." />
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsCreating(true)}
          >
            Create User
          </button>
        </div>

        <DataTable.InlineContent
          position="top"
          open={isCreating}
          onClose={() => setIsCreating(false)}
        >
          {({ onClose }) => (
            <div className="flex items-center gap-3 rounded-md border border-dashed border-primary/50 bg-primary/5 p-4">
              <span className="text-sm font-medium">New User:</span>
              <input
                type="text"
                placeholder="Name"
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              />
              <select className="rounded-md border border-input bg-background px-3 py-1.5 text-sm">
                <option value="">Role...</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
              <button
                type="button"
                className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  alert('User created!')
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

export const InlineContent: Story = {
  render: () => <InlineContentDemo />,
}

// ---------------------------------------------------------------------------
// Active Filters -- showcases all customization options
// ---------------------------------------------------------------------------

const sharedFilterOptions = {
  data: sampleUsers,
  columns,
  pageSize: 5,
  defaultFilters: {
    role: ['Admin', 'Editor'],
    status: 'active',
  },
} as const

const filterLabels = { role: 'Role', status: 'Status' }

const filterControls = (
  <div className="flex flex-wrap items-center gap-3">
    <DataTable.CheckboxFilter
      column="role"
      label="Roles"
      options={[
        { label: 'Admin', value: 'Admin' },
        { label: 'Editor', value: 'Editor' },
        { label: 'Viewer', value: 'Viewer' },
      ]}
    />
    <DataTable.SelectFilter
      column="status"
      label="Status"
      options={[
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ]}
    />
  </div>
)

function ActiveFiltersDemo() {
  return (
    <div className="flex flex-col gap-8">
      {/* Default variant */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Default</h3>
        <DataTable.Client {...sharedFilterOptions}>
          <div className="flex flex-col gap-4">
            {filterControls}
            <DataTable.ActiveFilters filterLabels={filterLabels} />
            <DataTable.Content emptyMessage="No users found." />
            <DataTable.Pagination />
          </div>
        </DataTable.Client>
      </div>

      {/* Custom label + button clear */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Custom label with button clear</h3>
        <DataTable.Client {...sharedFilterOptions}>
          <div className="flex flex-col gap-4">
            {filterControls}
            <DataTable.ActiveFilters
              label="Filters Applied"
              filterLabels={filterLabels}
              clearAll="button"
              clearAllLabel="Reset"
            />
            <DataTable.Content emptyMessage="No users found." />
            <DataTable.Pagination />
          </div>
        </DataTable.Client>
      </div>

      {/* No label + text clear */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">No label with text clear</h3>
        <DataTable.Client {...sharedFilterOptions}>
          <div className="flex flex-col gap-4">
            {filterControls}
            <DataTable.ActiveFilters
              label={null}
              filterLabels={filterLabels}
              clearAll="text"
              clearAllLabel="Clear filters"
            />
            <DataTable.Content emptyMessage="No users found." />
            <DataTable.Pagination />
          </div>
        </DataTable.Client>
      </div>
    </div>
  )
}

export const ActiveFilters: Story = {
  render: () => <ActiveFiltersDemo />,
}
