import type { DataTableFeatures } from '@datum-cloud/datum-ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import type { User } from '../helpers/mock-data'
import { DataTable } from '@datum-cloud/datum-ui/data-table'
import { useState } from 'react'
import { sampleUsers } from '../helpers/mock-data'

const columns: ColumnDef<DataTableFeatures, User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTable.ColumnHeader column={column} title="Name" density="compact" />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTable.ColumnHeader column={column} title="Email" density="compact" />,
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

interface ListPanelStoryArgs {
  loading: boolean
}

const meta: Meta<ListPanelStoryArgs> = {
  title: 'Features/DataTable/ListPanel',
  parameters: {
    docs: {
      description: {
        component:
          'The compact "list table" card used by list pages: a sticky mist header, dense borderless rows, '
          + 'a built-in search row, and card chrome, matching staff-portal\'s Figma list pattern. '
          + '`DataTable.ListPanel` composes `DataTable.Content` with `density="compact"` — pagination is a '
          + 'sibling (`DataTable.ListPagination`), not part of the panel, so callers control the gap between them.',
      },
    },
  },
  argTypes: {
    loading: { control: 'boolean' },
  },
  args: {
    loading: false,
  },
}
export default meta
type Story = StoryObj<ListPanelStoryArgs>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Uncontrolled (client-filtered) search, dense sticky header, and the matching `ListPagination` footer.',
      },
    },
  },
  render: args => (
    <DataTable.Client data={sampleUsers} columns={columns} pageSize={5} getRowId={row => row.id}>
      <div className="flex min-h-0 flex-1 flex-col gap-4" style={{ height: 420 }}>
        <DataTable.ListPanel
          search={{ placeholder: 'Search users...' }}
          emptyMessage="No users found."
          loading={args.loading}
        />
        <DataTable.ListPagination resourceLabel="users" />
      </div>
    </DataTable.Client>
  ),
}

export const ControlledSearch: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Passing `value`/`onChange` on `search` drives the input externally (e.g. a server-side search) — '
          + 'the panel renders whatever rows the caller already scoped, instead of filtering client-side.',
      },
    },
  },
  render: () => {
    function ControlledExample() {
      const [query, setQuery] = useState('')
      const filtered = sampleUsers.filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
      return (
        <DataTable.Client data={filtered} columns={columns} pageSize={5} getRowId={row => row.id}>
          <div className="flex min-h-0 flex-1 flex-col gap-4" style={{ height: 420 }}>
            <DataTable.ListPanel
              search={{ placeholder: 'Search users...', value: query, onChange: setQuery }}
              emptyMessage="No users found."
            />
            <DataTable.ListPagination resourceLabel="users" hideWhenSinglePage />
          </div>
        </DataTable.Client>
      )
    }
    return <ControlledExample />
  },
}

export const WithRowClick: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`onRowClick` fires with the row\'s original data, skipping clicks on links, buttons, checkboxes, '
          + 'and the row-actions menu — no DOM-walking required in the caller.',
      },
    },
  },
  render: () => (
    <DataTable.Client data={sampleUsers} columns={columns} pageSize={5} getRowId={row => row.id}>
      <DataTable.ListPanel
        search={{ placeholder: 'Search users...' }}
        onRowClick={user => console.log(`Open ${user.name}`)}
      />
    </DataTable.Client>
  ),
}

export const NoSearch: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set `search={false}` to hide the search row entirely — e.g. an embedded list with its own filters above it.',
      },
    },
  },
  render: () => (
    <DataTable.Client data={sampleUsers} columns={columns} pageSize={5} getRowId={row => row.id}>
      <DataTable.ListPanel search={false} />
    </DataTable.Client>
  ),
}

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: '`loading` renders a header + row skeleton in place of the table, sized to the current column count.',
      },
    },
  },
  render: () => (
    <DataTable.Client data={[]} columns={columns} pageSize={5} getRowId={row => row.id}>
      <DataTable.ListPanel search={{ placeholder: 'Search users...' }} loading />
    </DataTable.Client>
  ),
}
