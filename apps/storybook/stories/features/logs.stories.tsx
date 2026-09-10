import type { LogColumnSpec, LogFilters, LogTimeRange } from '@datum-cloud/datum-ui/logs'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  facetsFromEntries,
  filterEntries,
  lastThirtyMinutes,
  Logs,
} from '@datum-cloud/datum-ui/logs'
import { useMemo, useState } from 'react'
import { albLogEntries, logEntries as allEntries } from '../helpers/logs-fixture'

const facets = facetsFromEntries(allEntries)

const meta: Meta = {
  title: 'Features/Logs',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Vercel-style log explorer primitives for Loki/OTEL query results.\n\n'
          + '`Logs.Root` holds UI state. Host apps fetch `/loki/api/v1/query_range` and pass flattened entries. '
          + '`Logs.Explorer` is the batteries-included layout (Filters, Toolbar, Timeline, Table, Detail). To assemble '
          + 'those yourself, see Features/Logs/Composition. Requires `date-fns`.',
      },
    },
  },
}

export default meta
type Story = StoryObj

function ExplorerStory({
  source = allEntries,
  facets: facetList = facets,
  columns,
}: {
  source?: typeof allEntries
  facets?: typeof facets
  columns?: readonly LogColumnSpec[]
}) {
  const [filters, setFilters] = useState<LogFilters>({})
  const [search, setSearch] = useState('')
  const [timeRange, setTimeRange] = useState<LogTimeRange>(() => lastThirtyMinutes())
  const [live, setLive] = useState(false)
  const entries = useMemo(
    () => filterEntries(source, filters, search),
    [source, filters, search],
  )

  return (
    <div className="h-screen">
      <Logs.Root
        entries={entries}
        facets={facetList}
        filters={filters}
        search={search}
        timeRange={timeRange}
        live={live}
        columns={columns}
        onFiltersChange={setFilters}
        onSearchChange={setSearch}
        onTimeRangeChange={setTimeRange}
        onLiveChange={setLive}
        onRefresh={() => {}}
        onExport={() => {}}
      >
        <Logs.Explorer />
      </Logs.Root>
    </div>
  )
}

export const Explorer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Full explorer driven by a sample Loki `query_range` payload. Facet checkboxes and search filter client-side for the demo.',
      },
    },
  },
  render: () => <ExplorerStory />,
}

// One proxy's slice of the mixed fixture, as a host would pass after scoping
// the LogQL query to a resource. Service is not a facet since it is implied.
const proxyEntries = allEntries.filter(entry => entry.labels.resource_name === 'gateway-eu-west')
const proxyFacets = facetsFromEntries(proxyEntries, ['severity'])

export const SingleProxy: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Resource-scoped explorer for a single proxy: mixed access and application lines '
          + 'from one gateway, so the default Path / Message layout applies. Only severity is '
          + 'offered as a facet because the host already scoped the query.',
      },
    },
  },
  render: () => (
    <ExplorerStory
      source={proxyEntries}
      facets={proxyFacets}
      columns={['time', 'severity', 'status', 'path', 'message']}
    />
  ),
}

const albFacets = facetsFromEntries(albLogEntries, ['method', 'response_code'])

export const HttpAccess: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'HTTP access-log layout from a sanitised staging ALB `query_range`: hug Time/Status, fixed Host, Path fills. '
          + 'The line body is empty; method, path, and status come from Envoy OTEL stream labels.',
      },
    },
  },
  render: () => (
    <ExplorerStory
      source={albLogEntries}
      facets={albFacets}
      columns={['time', 'status', 'host', 'path']}
    />
  ),
}

export const CustomColumns: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Built-in ids mixed with a custom column. Size defaults to `fixed` / 160px.',
      },
    },
  },
  render: () => (
    <ExplorerStory
      source={albLogEntries}
      columns={[
        'time',
        'status',
        {
          id: 'request_id',
          header: 'Request ID',
          size: 'fixed',
          width: 180,
          cell: ({ entry }) => entry.labels.request_id ?? '—',
        },
        'path',
      ]}
    />
  ),
}

export const Table: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Dense log table with colored HTTP status codes for envoy access logs.',
      },
    },
  },
  render: () => (
    <Logs.Root entries={allEntries.slice(0, 12)} selectedId={allEntries[0]?.id}>
      <Logs.Table />
    </Logs.Root>
  ),
}

export const Timeline: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Histogram of log volume across the time range. Without a `histogram` prop, `Logs.Root` buckets the '
          + 'loaded entries client-side; pass server-side counts (e.g. LogQL `count_over_time`) so the bars '
          + 'reflect the whole window. The selected row\'s bucket is highlighted.',
      },
    },
  },
  render: () => (
    <Logs.Root entries={albLogEntries} selectedId={albLogEntries[8]?.id}>
      <Logs.Timeline />
    </Logs.Root>
  ),
}

export const Filters: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Filter sidebar with relative time-range presets (absolute picker as the escape hatch) and collapsible label facets.',
      },
    },
  },
  render: () => (
    <div className="h-[480px]">
      <Logs.Root entries={allEntries} facets={facets}>
        <Logs.Filters />
      </Logs.Root>
    </div>
  ),
}

export const Detail: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Detail panel for a selected HTTP access log. This sample is a staging ALB hit with an empty Body.',
      },
    },
  },
  render: () => {
    const httpEntry = albLogEntries.find(entry => entry.labels.path?.includes('demo-app'))
    return (
      <div className="h-[640px]">
        <Logs.Root entries={albLogEntries} selectedId={httpEntry?.id ?? albLogEntries[0]?.id}>
          <Logs.Detail />
        </Logs.Root>
      </div>
    )
  },
}
