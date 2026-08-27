import type { DataTableFeatures } from '@datum-cloud/datum-ui/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Badge } from '@datum-cloud/datum-ui/badge'
import { Button } from '@datum-cloud/datum-ui/button'
import { Card, CardContent } from '@datum-cloud/datum-ui/card'
import { EmptyContent } from '@datum-cloud/datum-ui/empty-content'
import { GroupedTable } from '@datum-cloud/datum-ui/grouped-table'
import { Icon } from '@datum-cloud/datum-ui/icons'
import { ArrowUpIcon } from 'lucide-react'

interface QuotaRow {
  name: string
  description: string
  used: number
  total: number
}

const NEAR_LIMIT = 90

function usagePercent(row: QuotaRow): number {
  return row.total > 0 ? Math.round((row.used / row.total) * 100) : 0
}

function progressBarColor(percentage: number, limit: number): string {
  if (limit === 0)
    return 'bg-gray-400'
  if (percentage <= 70)
    return 'bg-green-500'
  if (percentage <= 90)
    return 'bg-yellow-500'
  return 'bg-red-500'
}

function groupTitle(label: string, count: number): ReactNode {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium">{label}</span>
      <Badge
        type="secondary"
        className="text-2xs flex cursor-default items-center gap-1.5 px-1 py-0.5 font-bold"
      >
        {count}
      </Badge>
    </div>
  )
}

function quotaGroup(id: string, title: string, rows: QuotaRow[]) {
  return { id, title: groupTitle(title, rows.length), rows }
}

const columns: ColumnDef<DataTableFeatures, QuotaRow, unknown>[] = [
  {
    id: 'resource',
    accessorKey: 'name',
    header: 'Resource',
    cell: ({ row }) => (
      <div>
        <span className="block font-medium">{row.original.name}</span>
        {row.original.description && (
          <span className="text-muted-foreground mt-0.5 block text-xs">
            {row.original.description}
          </span>
        )}
      </div>
    ),
  },
  {
    id: 'usage',
    header: 'Usage',
    size: 120,
    accessorFn: row => row.used,
    cell: ({ row }) => (
      <span className="text-xs font-semibold whitespace-nowrap">
        {`${row.original.used} / ${row.original.total}`}
      </span>
    ),
  },
  {
    id: 'percent',
    header: '% Used',
    size: 220,
    accessorFn: row => usagePercent(row),
    cell: ({ row }) => {
      const percentage = usagePercent(row.original)
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted h-2 flex-1 rounded-full">
            <div
              className={`${progressBarColor(percentage, row.original.total)} h-2 rounded-full transition-all`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <span className="text-muted-foreground text-xs font-medium whitespace-nowrap">
            {percentage}
            %
          </span>
        </div>
      )
    },
  },
  {
    id: 'action',
    size: 170,
    enableSorting: false,
    cell: ({ row }) =>
      usagePercent(row.original) > NEAR_LIMIT
        ? (
            <div className="flex justify-end pr-1">
              <Button
                type="quaternary"
                theme="outline"
                size="small"
                className="h-7 gap-1 px-2 text-xs whitespace-nowrap"
              >
                <Icon icon={ArrowUpIcon} className="h-4 w-4" />
                Request Limit
              </Button>
            </div>
          )
        : null,
  },
]

const dnsRows: QuotaRow[] = [
  {
    name: 'DNS Zones',
    description: 'Maximum number of DNS zones that can be created in this project.',
    used: 1,
    total: 25,
  },
  {
    name: 'DNS Record Sets',
    description: 'Maximum number of DNS record sets across all zones.',
    used: 12,
    total: 250,
  },
]

const networkingRows: QuotaRow[] = [
  {
    name: 'Gateways',
    description: 'Maximum number of gateways that can be created in this project.',
    used: 4,
    total: 10,
  },
  {
    name: 'HTTP Routes',
    description: 'Maximum number of HTTP routes attached to gateways.',
    used: 4,
    total: 25,
  },
  {
    name: 'HTTP Proxies',
    description: 'Maximum number of HTTP proxies that can be created.',
    used: 1,
    total: 25,
  },
  {
    name: 'Domains',
    description: 'Maximum number of custom domains bound to this project.',
    used: 6,
    total: 25,
  },
  {
    name: 'TLS Certificates',
    description: 'Maximum number of TLS certificates managed in this project.',
    used: 3,
    total: 25,
  },
  {
    name: 'Backend Services',
    description: 'Maximum number of backend services attached to HTTP routes.',
    used: 8,
    total: 25,
  },
  {
    name: 'Health Checks',
    description: 'Maximum number of active health checks.',
    used: 2,
    total: 50,
  },
  {
    name: 'Listener Ports',
    description: 'Maximum number of listener ports across all gateways.',
    used: 9,
    total: 50,
  },
  {
    name: 'IP Addresses',
    description: 'Maximum number of allocated IP addresses.',
    used: 4,
    total: 10,
  },
  {
    name: 'Network Policies',
    description: 'Maximum number of network policies in this project.',
    used: 1,
    total: 25,
  },
  {
    name: 'Firewall Rules',
    description: 'Maximum number of firewall rules attached to gateways.',
    used: 23,
    total: 25,
  },
  {
    name: 'Load Balancers',
    description: 'Maximum number of load balancers that can be created.',
    used: 2,
    total: 10,
  },
  {
    name: 'Egress Endpoints',
    description: 'Maximum number of egress endpoints.',
    used: 0,
    total: 10,
  },
]

const computeRows: QuotaRow[] = [
  {
    name: 'vCPU seconds',
    description: 'Compute time billed against the project allowance.',
    used: 12,
    total: 100,
  },
]

const gitRows: QuotaRow[] = [
  {
    name: 'Input tokens',
    description: 'Prompt tokens consumed by Git Assistant.',
    used: 40,
    total: 100,
  },
  {
    name: 'Output tokens',
    description: 'Completion tokens produced by Git Assistant.',
    used: 18,
    total: 100,
  },
]

const storageRows: QuotaRow[] = [
  {
    name: 'Object bytes',
    description: 'Stored object bytes against the project allowance.',
    used: 2,
    total: 50,
  },
]

const groups = [
  quotaGroup('dns', 'DNS', dnsRows),
  quotaGroup('networking', 'Networking', networkingRows.slice(0, 4)),
]

const manyGroups = [
  quotaGroup('compute', 'Compute', computeRows),
  quotaGroup('git', 'Git Assistant', gitRows),
  quotaGroup('storage', 'Storage', storageRows),
  quotaGroup('networking', 'Networking', networkingRows.slice(0, 4)),
]

const quotaGroups = [
  quotaGroup('dns', 'DNS', dnsRows),
  quotaGroup('networking', 'Networking', networkingRows),
]

const portalChrome = {
  className: 'grouped-table-portal',
  groupHeaderClassName:
    'bg-background text-foreground hover:bg-table-cell-hover h-[42px] border-r px-4 py-3 text-xs font-medium transition-all',
  enableSorting: true,
  enableSearch: true,
  searchPlaceholder: 'Search resources…',
  searchableColumns: ['name'] as string[],
  searchFn: (row: QuotaRow, query: string) => {
    const q = query.toLowerCase()
    return row.name.toLowerCase().includes(q) || row.description.toLowerCase().includes(q)
  },
  getRowId: (row: QuotaRow) => row.name,
  defaultExpanded: 'all' as const,
}

const meta: Meta<typeof GroupedTable<QuotaRow>> = {
  title: 'Features/GroupedTable',
  component: GroupedTable,
  args: {
    columns,
    groups,
    ...portalChrome,
  },
}
export default meta
type Story = StoryObj<typeof GroupedTable<QuotaRow>>

export const Default: Story = {}

/** Matches the cloud-portal Quotas table: search, resource + description, usage, and % used. */
export const Quotas: Story = {
  args: { groups: quotaGroups },
}

export const Sortable: Story = {}

export const Selectable: Story = {
  args: { enableRowSelection: true },
}

export const WithRowActions: Story = {
  args: {
    rowActions: (row: QuotaRow) => [
      { label: 'View', onClick: () => console.warn('view', row.name) },
      { label: 'Edit', onClick: () => console.warn('edit', row.name) },
    ],
  },
}

export const Searchable: Story = {}

export const FullFeatured: Story = {
  args: {
    enableRowSelection: true,
    rowActions: (row: QuotaRow) => [
      { label: 'View', onClick: () => console.warn('view', row.name) },
      { label: 'Edit', onClick: () => console.warn('edit', row.name) },
    ],
  },
}

export const Loading: Story = {
  args: { isLoading: true },
}

export const Empty: Story = {
  args: {
    groups: [],
    empty: <EmptyContent title="No quotas found" />,
  },
}

export const ManyGroups: Story = {
  args: { groups: manyGroups },
}

/** Reproduces the usage-dashboard card: overflow-hidden plus several groups. The last group must stay visible. */
export const InOverflowCard: Story = {
  args: { groups: manyGroups },
  decorators: [Story => (
    <Card className="overflow-hidden rounded-xl py-0 shadow-none">
      <CardContent className="p-0">
        <Story />
      </CardContent>
    </Card>
  )],
}

export const LastGroupCollapsed: Story = {
  args: {
    groups: manyGroups,
    defaultExpanded: ['compute', 'git', 'storage'],
  },
  decorators: [Story => (
    <Card className="overflow-hidden rounded-xl py-0 shadow-none">
      <CardContent className="p-0">
        <Story />
      </CardContent>
    </Card>
  )],
}
