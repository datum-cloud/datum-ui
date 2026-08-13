# Logs

Compound primitives for a Vercel-style log explorer. Host apps fetch Loki `query_range` / label APIs; this package presents the data, holds UI state, and helps build LogQL.

```tsx
import {
  flattenLokiStreams,
  facetsFromEntries,
  buildLogQL,
  Logs,
} from '@datum-cloud/datum-ui/logs'

const entries = flattenLokiStreams(response)

<Logs.Root
  entries={entries}
  facets={facetsFromEntries(entries)}
  timeRange={timeRange}
  filters={filters}
  search={search}
  onTimeRangeChange={setTimeRange}
  onFiltersChange={setFilters}
  onSearchChange={setSearch}
  onRefresh={refetch}
>
  <Logs.Explorer />
</Logs.Root>
```

`buildLogQL({ matchers: filters, lineContains: search })` produces a LogQL selector for `/loki/api/v1/query_range`.

On a single-resource page, query with that matcher already applied, pass only the remaining facets (usually `severity`), and hide implied columns:

```tsx
<Logs.Root
  entries={entries}
  facets={facets.filter(facet => facet.name === 'severity')}
  columns={['time', 'severity', 'status', 'message']}
>
  <Logs.Explorer />
</Logs.Root>
```

Assemble a custom chrome with `Logs.Filters`, `Logs.Toolbar`, `Logs.Table`, and `Logs.Detail` instead of `Logs.Explorer`.
