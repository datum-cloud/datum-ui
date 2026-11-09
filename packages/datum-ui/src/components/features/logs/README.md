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

`filterEntries(entries, filters, search)` is the client-side helper behind those demos. Search matches the line, plus the fields the table shows for a label-only access log (method, path, status, host via `searchableLogText`). It does not look at other labels such as `request_id` or `user_agent`, so every hit is visible on screen.

`columns` accepts built-in ids and column objects. Unknown ids are skipped with a console warning in development rather than throwing, so a typo or a stale URL-driven column list degrades to a narrower table.

The table shows one state at a time. Skeleton rows appear only while loading with nothing to show; an error with no rows renders the in-table error state; an error while rows are already on screen (a failed refresh) keeps the rows and shows a slim `logs-error-banner` above them with the message and Retry.

## URL state

`useLogsUrlState()` keeps the time range, filters, search, live toggle and open row in the query string, so a refresh, the back button or a shared link reopens the same view. Spread its result onto `Logs.Root`, and read the same values to build the query:

```tsx
import { buildLogQL, Logs, resolveLogTimeRange, useLogsUrlState } from '@datum-cloud/datum-ui/logs'

const logsState = useLogsUrlState()
const query = buildLogQL({ matchers: logsState.filters, lineContains: logsState.search })
const { from, to } = resolveLogTimeRange(logsState.timeRange)

<Logs.Root {...logsState} entries={entries} onRefresh={refetch}>
  <Logs.Explorer />
</Logs.Root>
```

With no arguments it reads and writes `window.location` through the History API. That suits plain pages and Next.js App Router, which follows History API calls. If a client router owns the URL (React Router, TanStack Router), pass its search params instead. Writing `window.history` behind the router's back leaves its location stale, and its next navigation can drop these params:

```tsx
const [searchParams, setSearchParams] = useSearchParams()
const logsState = useLogsUrlState({ searchParams, setSearchParams })
```

The URL looks like `?range=last-1h&filter=severity:ERROR&filter=service_name:waf&q=timeout&live=1&log=<entry id>`. A hand-picked range is written as `from` and `to` ISO timestamps instead of `range`. Defaults are left out, params the app owns are kept, and malformed values fall back to defaults so an old or hand-edited link still opens. Changes replace the current history entry; pass `history: 'push'` to add one per change. Pass `prefix: 'logs.'` when two explorers share a page or a key clashes with one the app uses, and `defaultTimeRange` if the page doesn't default to the last 30 minutes.

A preset range is resolved to "now" when the URL is read, and the hook hands back the same `timeRange` object until one of its own params changes, so it is safe to use as a query key. Call `resolveLogTimeRange` before each refresh as usual. `parseLogsUrlState` and `writeLogsUrlState` are the same conversion without React, for loaders or server code.

The open row (`log`) is an entry id, which is only stable while the same query returns the same lines. On a link with a preset range the row may have scrolled out of the window, and the detail panel simply stays closed.

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

## Facet options from Loki

`facetsFromEntries` only sees the rows you fetched. If those rows came from a query that already applies the user's facet selections, ticking `200` refetches only 200s and every other status code drops out of the list. The counts also only cover the page (around 100 lines), not the window.

To keep every option listed with its real total for the time range, fetch facets separately, scoped by the page's own matchers but not by the user's selections or search:

```ts
import { buildLogFacetCountQuery, facetFromLokiCounts } from '@datum-cloud/datum-ui/logs'

const query = buildLogFacetCountQuery({
  label: 'response_code',
  matchers: { route_name: [routeName] }, // page scope only
  timeRange: resolveLogTimeRange(timeRange),
})
// sum by (response_code) (count_over_time({route_name="..."}[1800s]))
// Run as an instant query: GET /loki/api/v1/query?query=...&time=<timeRange.to>

const facet = facetFromLokiCounts('response_code', response, { label: 'Status code' })
```

Run one query per facet, in parallel, and refetch them when the time range or scope changes, not when filters change. Loki can group by indexed stream labels and by structured metadata. A facet derived in the browser from several labels (such as the Host column, via `logRequestHost`) has no single label to group by, so keep building that one from entries.

Whatever the facets contain, `Logs.Filters` always lists the values that are ticked, so a selection can always be cleared.

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

HTTP access logs can swap Resource for Host. The Host cell uses `logRequestHost(labels)`: an explicit `host` label first, then the name the client asked for (`requested_server_name`, `x_forwarded_host`), then the upstream `authority`, then `resource_name`. Built-in columns size themselves (`hug` Time/Status, `fixed` Host/Resource, `fill` Path/Message) so hosts do not need table CSS:

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

## Detail panel

For HTTP entries the Request section lists method, status, duration, path, search params, and, when the entry carries a User-Agent (`user_agent`, `http_user_agent`, `useragent`, `ua`, or `http.user_agent` label), a Client row. `parseUserAgent` turns the header into a short summary such as "Chrome 128 on macOS" or "Safari 17 on iOS 17.5.1" with a device icon (desktop, mobile, tablet, bot) and shows the raw string underneath with a copy button. The parser is intentionally small: mainstream browsers and their forks, iOS / Android / Windows / macOS / Linux / ChromeOS, common CLI and SDK clients (curl, python-requests, Go, okhttp, axios), and anything that names itself a bot or probe. Desktop OS versions are not shown because browsers freeze or blur them. `logUserAgent(labels)` and `parseUserAgent(raw)` are exported for hosts that want the same summary elsewhere.

Assemble a custom chrome with `Logs.Filters`, `Logs.Toolbar`, `Logs.Timeline`, `Logs.Table`, and `Logs.Detail` instead of `Logs.Explorer`. On desktop, `Logs.Detail` overlays the table — wrap both in a `relative` container so the panel has a positioning ancestor.
