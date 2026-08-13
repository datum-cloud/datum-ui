import type { LogFilters, LogTimeRange } from '@datum-cloud/datum-ui/logs'
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
          + '`Logs.Explorer` composes filters, toolbar, timeline, table, and a detail panel. '
          + 'Requires `date-fns` and `recharts`.',
      },
    },
  },
}

export default meta
type Story = StoryObj

function ExplorerStory() {
  const [filters, setFilters] = useState<LogFilters>({})
  const [search, setSearch] = useState('')
  const [timeRange, setTimeRange] = useState<LogTimeRange>(() => lastThirtyMinutes())
  const [live, setLive] = useState(false)
  const entries = useMemo(
    () => filterEntries(allEntries, filters, search),
    [filters, search],
  )

  return (
    <div className="h-screen">
      <Logs.Root
        entries={entries}
        facets={facets}
        filters={filters}
        search={search}
        timeRange={timeRange}
        live={live}
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

export const Table: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Dense log table with HTTP status badges for envoy access logs.',
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

export const Timeline: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Density histogram derived from the current entries.',
      },
    },
  },
  render: () => (
    <Logs.Root entries={allEntries}>
      <Logs.Timeline />
    </Logs.Root>
  ),
}
