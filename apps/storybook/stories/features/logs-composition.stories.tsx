import type { LogFilters, LogTimeRange } from '@datum-cloud/datum-ui/logs'
import type { ReactNode } from 'react'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import {
  facetsFromEntries,
  filterEntries,
  flattenLokiStreams,
  lastThirtyMinutes,
  Logs,
  useLogs,
} from '@datum-cloud/datum-ui/logs'
import { queryRangeFixture } from '@datum-cloud/datum-ui/logs/fixtures'
import { useMemo, useState } from 'react'

const allEntries = flattenLokiStreams(queryRangeFixture)
const facets = facetsFromEntries(allEntries)

const meta: Meta = {
  title: 'Features/Logs/Composition',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'How to assemble Logs primitives yourself instead of `Logs.Explorer`.\n\n'
          + 'Wrap any combination in `Logs.Root`. The host fetches Loki `query_range`, flattens with '
          + '`flattenLokiStreams`, and passes entries in. Facet and search changes in these demos filter '
          + 'client-side; a real host would rebuild LogQL with `buildLogQL` and refetch.',
      },
    },
  },
}

export default meta
type Story = StoryObj

function Playground({
  children,
  source = allEntries,
  facets: facetList = facets,
}: {
  children: ReactNode
  source?: typeof allEntries
  facets?: typeof facets
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
    <Logs.Root
      entries={entries}
      facets={facetList}
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
      {children}
    </Logs.Root>
  )
}

export const CustomChrome: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The Explorer layout written out: `Filters` + `Toolbar` + `Table` + `Detail`. '
          + 'Use this when you need a different shell, extra chrome, or to drop a pane.',
      },
    },
  },
  render: () => (
    <div className="h-screen">
      <Playground>
        <div className="flex h-full min-h-0 overflow-hidden">
          <Logs.Filters />
          <div className="flex min-w-0 flex-1 flex-col">
            <Logs.Toolbar />
            <div className="flex min-h-0 flex-1">
              <Logs.Table />
              <Logs.Detail />
            </div>
          </div>
        </div>
      </Playground>
    </div>
  ),
}

export const TableWithDetail: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Embed on a resource page that already scoped the query. No filter sidebar; '
          + 'toolbar + table + sliding detail only.',
      },
    },
  },
  render: () => (
    <div className="h-screen">
      <Playground
        source={filterEntries(allEntries, { service_name: ['envoy-gateway'] })}
        facets={facets.filter(facet => facet.name === 'severity')}
      >
        <div className="flex h-full min-h-0 flex-col">
          <Logs.Toolbar />
          <div className="flex min-h-0 flex-1">
            <Logs.Table />
            <Logs.Detail />
          </div>
        </div>
      </Playground>
    </div>
  ),
}

function SeverityFilters() {
  const { facets: facetList, resetFilters, hasActiveFilters } = useLogs()
  const severity = facetList.find(facet => facet.name === 'severity')

  return (
    <aside className="bg-background flex h-full w-64 shrink-0 flex-col border-r">
      <div className="flex items-center justify-between px-3 py-3">
        <h2 className="text-sm font-semibold">Filters</h2>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground text-xs disabled:opacity-40"
          disabled={!hasActiveFilters}
          onClick={resetFilters}
        >
          Reset
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Logs.TimeRangeFilter />
        {severity && <Logs.FilterGroup facet={severity} defaultOpen />}
      </div>
    </aside>
  )
}

export const CustomFacets: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Build a sidebar from `TimeRangeFilter` and `FilterGroup` instead of `Logs.Filters`. '
          + '`useLogs()` reads facets and reset from Root. Here only severity is shown.',
      },
    },
  },
  render: () => (
    <div className="h-screen">
      <Playground facets={facets.filter(facet => facet.name === 'severity')}>
        <div className="flex h-full min-h-0 overflow-hidden">
          <SeverityFilters />
          <div className="flex min-w-0 flex-1 flex-col">
            <Logs.Toolbar />
            <div className="flex min-h-0 flex-1">
              <Logs.Table />
              <Logs.Detail />
            </div>
          </div>
        </div>
      </Playground>
    </div>
  ),
}

export const CustomToolbar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`Logs.Toolbar` always includes Search, Live, Refresh, and Export. Pass `children` for extra '
          + 'actions between search and Live. To replace the toolbar entirely, compose `Logs.Search` and '
          + '`Logs.LiveToggle` yourself — see ToolbarPieces.',
      },
    },
  },
  render: () => (
    <div className="h-screen">
      <Playground>
        <div className="flex h-full min-h-0 flex-col">
          <Logs.Toolbar>
            <Button type="secondary" theme="outline" size="small">
              Copy LogQL
            </Button>
          </Logs.Toolbar>
          <Logs.Table />
        </div>
      </Playground>
    </div>
  ),
}

export const ToolbarPieces: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A host toolbar that does not use `Logs.Toolbar`. Search and Live are still wired through Root. '
          + 'Refresh is a host button calling `onRefresh`.',
      },
    },
  },
  render: () => (
    <div className="h-screen">
      <Playground>
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Logs.Search placeholder="Filter this page..." />
            <Button type="secondary" theme="outline" size="small">
              Jump to now
            </Button>
            <Logs.LiveToggle />
          </div>
          <div className="flex min-h-0 flex-1">
            <Logs.Table />
            <Logs.Detail />
          </div>
        </div>
      </Playground>
    </div>
  ),
}

export const Loading: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Pass `isLoading` with no entries to show table skeletons.',
      },
    },
  },
  render: () => (
    <div className="h-[360px]">
      <Logs.Root entries={[]} isLoading>
        <Logs.Table />
      </Logs.Root>
    </div>
  ),
}

export const ErrorState: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Pass `error` for a failed query. The empty-range message is not shown.',
      },
    },
  },
  render: () => (
    <div className="h-[240px]">
      <Logs.Root entries={[]} error="queryapi returned 400: aggregations are not supported">
        <Logs.Table />
      </Logs.Root>
    </div>
  ),
}

export const Empty: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'No entries and no error. Dense tables use a muted row, not `EmptyContent`.',
      },
    },
  },
  render: () => (
    <div className="h-[240px]">
      <Logs.Root entries={[]}>
        <Logs.Table />
      </Logs.Root>
    </div>
  ),
}
