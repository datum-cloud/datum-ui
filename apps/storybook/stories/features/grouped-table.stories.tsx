import type { ColumnDef } from '@tanstack/react-table'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Badge } from '@datum-cloud/datum-ui/badge'
import { GroupedTable } from '@datum-cloud/datum-ui/grouped-table'

interface Row { name: string, used: number, total: number, status: string }
const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: 'name', header: 'Resource', cell: i => i.getValue() as string, size: 220 },
  { id: 'usage', header: 'Usage', cell: i => `${i.row.original.used} / ${i.row.original.total}` },
  { accessorKey: 'status', header: 'Status', cell: i => i.getValue() as string, size: 140 },
]
const groups = [
  { id: 'networking', title: 'Networking', meta: <Badge>1 near limit</Badge>, rows: [
    { name: 'HTTP Proxies', used: 8, total: 10, status: 'Near limit' },
    { name: 'Domains', used: 6, total: 25, status: 'Healthy' },
  ] },
  { id: 'dns', title: 'DNS', meta: <Badge>healthy</Badge>, rows: [
    { name: 'DNS Zones', used: 4, total: 25, status: 'Healthy' },
  ] },
]

const meta: Meta<typeof GroupedTable<Row>> = { title: 'Features/GroupedTable', component: GroupedTable }
export default meta
type Story = StoryObj<typeof GroupedTable<Row>>

export const Default: Story = { args: { columns, groups } }
export const Sortable: Story = { args: { columns, groups, enableSorting: true } }
export const Selectable: Story = { args: { columns, groups, enableRowSelection: true, getRowId: (r: Row) => r.name } }
export const WithRowActions: Story = { args: { columns, groups, rowActions: (row: Row) => [
  { label: 'View', onClick: () => console.warn('view', row.name) },
  { label: 'Edit', onClick: () => console.warn('edit', row.name) },
] } }
export const Searchable: Story = { args: { columns, groups, enableSearch: true, searchableColumns: ['name'], searchPlaceholder: 'Search resources' } }
export const FullFeatured: Story = { args: { columns, groups, enableSorting: true, enableRowSelection: true, enableSearch: true, rowActions: (row: Row) => [
  { label: 'View', onClick: () => console.warn('view', row.name) },
  { label: 'Edit', onClick: () => console.warn('edit', row.name) },
], getRowId: (r: Row) => r.name, searchableColumns: ['name'] } }
export const Loading: Story = { args: { columns, groups, isLoading: true } }
export const Empty: Story = { args: { columns, groups: [], empty: <div className="p-6 text-center text-sm text-muted-foreground">No data</div> } }
