import type { LogColumnId, LogFilters, LogTimeRange } from '@datum-cloud/datum-ui/logs'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  facetsFromEntries,
  filterEntries,
  flattenLokiStreams,
  lastThirtyMinutes,
  Logs,
  queryRangeFixture,
} from '@datum-cloud/datum-ui/logs'
import { useMemo, useState } from 'react'

const allEntries = flattenLokiStreams(queryRangeFixture)
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
          + '`Logs.Explorer` is the batteries-included layout. To assemble Filters, Toolbar, Table, and Detail '
          + 'yourself, see Features/Logs/Composition. Requires `date-fns`.',
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
  columns?: readonly LogColumnId[]
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

const proxyEntries = filterEntries(allEntries, {
  service_name: ['envoy-gateway'],
  resource_name: ['gateway-eu-west'],
})
const proxyFacets = facetsFromEntries(proxyEntries).filter(facet => facet.name === 'severity')

export const SingleProxy: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Resource-scoped explorer, as on a specific proxy page. The host queries one '
          + '`service_name` / `resource_name` (here `envoy-gateway` / `gateway-eu-west`), '
          + 'omits those labels from the facet sidebar, and hides the Service column. '
          + 'Severity stays visible because it is still a per-line attribute.',
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

export const Filters: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Filter sidebar with time range and collapsible label facets.',
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
        story: 'Detail panel for a selected HTTP access log.',
      },
    },
  },
  render: () => {
    const httpEntry = allEntries.find(entry => entry.line.startsWith('GET ') || entry.line.startsWith('POST '))
    return (
      <div className="h-[640px]">
        <Logs.Root entries={allEntries} selectedId={httpEntry?.id ?? allEntries[0]?.id}>
          <Logs.Detail />
        </Logs.Root>
      </div>
    )
  },
}
