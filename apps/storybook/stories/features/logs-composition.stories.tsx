import type { LogFilters, LogTimeRange } from '@datum-cloud/datum-ui/logs'
import type { ReactNode } from 'react'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import {
  facetsFromEntries,
  filterEntries,
  lastThirtyMinutes,
  Logs,
  useLogs,
} from '@datum-cloud/datum-ui/logs'
import { useMemo, useState } from 'react'
import { logEntries as allEntries } from '../helpers/logs-fixture'

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
            <div className="relative flex min-h-0 flex-1">
              <Logs.Table />
              <Logs.Detail />
            </div>
          </div>
        </div>
      </Playground>
    </div>
  ),
}

export const WithTimeline: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`Logs.Timeline` sits between the toolbar and the table. It reads `histogram` from Root, '
          + 'falling back to client-side buckets of the loaded entries.',
      },
    },
  },
  render: () => (
    <div className="h-screen">
      <Playground>
        <div className="flex h-full min-h-0 flex-col">
          <Logs.Toolbar />
          <Logs.Timeline />
          <div className="relative flex min-h-0 flex-1">
            <Logs.Table />
            <Logs.Detail />
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
          <div className="relative flex min-h-0 flex-1">
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
            <div className="relative flex min-h-0 flex-1">
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
          <div className="relative flex min-h-0 flex-1">
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
        story:
          'Pass `isLoading` with no entries to show one skeleton cell per column, matching real row shape.',
      },
    },
  },
  render: () => (
    <div className="h-[360px]">
      <Logs.Root entries={[]} isLoading columns={['time', 'status', 'host', 'path']}>
        <Logs.Table />
      </Logs.Root>
    </div>
  ),
}

export const FiltersLoading: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Filter sidebar skeleton while `isLoading` and facets have not arrived yet.',
      },
    },
  },
  render: () => (
    <div className="h-[480px]">
      <Logs.Root entries={[]} isLoading facets={[]}>
        <Logs.Filters />
      </Logs.Root>
    </div>
  ),
}

export const ErrorState: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Pass `error` for a failed query. It renders inside the table with the raw message and a Retry '
          + 'button when `onRefresh` is set. The empty-range message is not shown.',
      },
    },
  },
  render: () => (
    <div className="h-[320px]">
      <Logs.Root
        entries={[]}
        error="queryapi returned 400: aggregations are not supported"
        onRefresh={() => {}}
      >
        <Logs.Table />
      </Logs.Root>
    </div>
  ),
}

export const RefreshFailed: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'When `error` arrives while rows are already on screen (a failed refresh or live poll), '
          + 'the rows stay put and a slim banner above them carries the message and Retry. '
          + 'Loading, error, and empty states never render together.',
      },
    },
  },
  render: () => (
    <div className="h-[420px]">
      <Logs.Root
        entries={allEntries.slice(0, 8)}
        error="queryapi returned 503: upstream unavailable"
        onRefresh={() => {}}
      >
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
        story:
          'No entries and no error. Dense tables use an in-table state, not `EmptyContent`. '
          + 'With active filters or a search term it offers a Clear filters action.',
      },
    },
  },
  render: () => (
    <div className="h-[320px]">
      <Logs.Root entries={[]} defaultFilters={{ severity: ['ERROR'] }}>
        <Logs.Table />
      </Logs.Root>
    </div>
  ),
}
