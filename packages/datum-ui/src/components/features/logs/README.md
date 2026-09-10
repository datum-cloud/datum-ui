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
  live={live}
  onTimeRangeChange={setTimeRange}
  onFiltersChange={setFilters}
  onSearchChange={setSearch}
  onLiveChange={setLive}
  onRefresh={refetch}
>
  <Logs.Explorer />
</Logs.Root>
```

`buildLogQL({ matchers: filters, lineContains: search })` produces a LogQL selector for `/loki/api/v1/query_range`. Label names must match `[a-zA-Z_][a-zA-Z0-9_]*`; anything else is dropped. Path, HTTP method, and status are parsed from the line for display, and from Envoy/OTEL stream labels (`method`, `path`, `response_code`, `duration`) when the Body is empty. They are not Loki stream matchers unless the host actually indexed them as labels.

Import demo Loki JSON from `@datum-cloud/datum-ui/logs/fixtures` (`queryRangeFixture` for mixed app logs, `albQueryRangeFixture` for a sanitised staging ALB `query_range`). The ALB sample keeps an empty line and HTTP fields on labels — the explorer reconstructs the access-log view from those attributes.

The table renders every row it is given. There is no virtualization yet, so keep the Loki `limit` around the default of 100. A few thousand lines will mount tens of thousands of DOM nodes.

The host owns fetching. Facet checkboxes and search in Storybook filter client-side for the demo; in production, rebuild LogQL and refetch. `Live` is a pressed-state toggle (`onLiveChange`). Polling, tailing, and sliding the time window are host responsibilities.

## Time range

The sidebar time control leads with relative presets (`LOG_TIME_PRESETS`: last 15 minutes through last 7 days) and keeps the absolute date/time picker beside them. Picking a preset stores its key on `LogTimeRange.preset`; hand-picked ranges have no `preset`. Before each refresh or poll, call `resolveLogTimeRange(range)` to re-anchor a preset window to "now" — absolute ranges pass through unchanged. `logTimeRangeLabel(range)` gives the same text the trigger shows.

```ts
const query = resolveLogTimeRange(timeRange) // { from, to, preset: 'last-30m' } slid to now
```

## Timeline

`Logs.Explorer` renders `Logs.Timeline` between the toolbar and the table: a histogram of log volume across the time range with the selected row's bucket highlighted. Without a `histogram` prop, `Logs.Root` buckets the loaded `entries` across `timeRange` (60 buckets), which only reflects the page you fetched. For the whole window, pass server-side counts:

```tsx
<Logs.Root
  entries={entries}
  histogram={buckets} // LogHistogramBucket[]: { start, end, count }
  timeRange={timeRange}
>
```

A LogQL `count_over_time` range query (`sum(count_over_time({...}[step]))` with `step = (to - from) / 60`) maps directly onto `LogHistogramBucket`.

`facetsFromEntries` defaults to `severity`, `service_name`, and `resource_name`. Pass a name list as the second argument to include other labels.

On a single-resource page, query with that matcher already applied, pass only the remaining facets (usually `severity`), and hide implied columns:

```tsx
<Logs.Root
  entries={entries}
  facets={facets.filter(facet => facet.name === 'severity')}
  columns={['time', 'severity', 'status', 'path', 'message']}
>
  <Logs.Explorer />
</Logs.Root>
```

HTTP access logs can swap Resource for Host. Built-in columns size themselves (`hug` Time/Status, `fixed` Host/Resource, `fill` Path/Message) so hosts do not need table CSS:

```tsx
<Logs.Root
  entries={entries}
  columns={['time', 'status', 'host', 'path']}
>
  <Logs.Explorer />
</Logs.Root>
```

Mix built-in ids with custom columns. Custom columns default to `fixed` / 160px:

```tsx
<Logs.Root
  entries={entries}
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
>
  <Logs.Explorer />
</Logs.Root>
```

Assemble a custom chrome with `Logs.Filters`, `Logs.Toolbar`, `Logs.Timeline`, `Logs.Table`, and `Logs.Detail` instead of `Logs.Explorer`. On desktop, `Logs.Detail` overlays the table — wrap both in a `relative` container so the panel has a positioning ancestor.
