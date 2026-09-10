---
"@datum-cloud/datum-ui": minor
---

Bring the logs explorer closer to a Vercel-style log view: column sizing, custom columns, accurate loading, relative time presets, a timeline histogram, and a tighter detail header.

Built-in columns hug Time/Status, cap Host/Resource, and let Path fill the leftover width so consumers do not need CSS overrides. `host` is a first-class column, and a column object can sit next to a built-in id for anything else. Loading draws one skeleton cell per column (real row height) and a filter-sidebar skeleton while facets are empty. The unlabeled LOG badge uses solid muted styling so it stays readable in light mode.

The time-range control now leads with relative presets ("Last 30 minutes" … "Last 7 days") and shows the preset name in the trigger instead of a truncated absolute range; the absolute picker stays as the escape hatch. `LogTimeRange` gains an optional `preset` key, with `LOG_TIME_PRESETS`, `resolveLogTimeRange` (slide a preset window to now before refetching), and `logTimeRangeLabel` exported. The picker also highlights the preset carried on a hydrated value.

`Logs.Timeline` (included in `Logs.Explorer`) renders a histogram of log volume across the range and highlights the selected row's bucket. Pass server-side counts through the new `histogram` prop on `Logs.Root`; without it, loaded entries are bucketed client-side (`histogramFromEntries`).

The detail panel overlays the table and can be dragged wider (never below 400px). Its header puts the HTTP status chip inline with the title and shows an absolute timestamp with the detailed tooltip, so the meta row no longer wraps or collapses. The Request section breaks the query string out into a "Search params" list, and the Status column reads status-then-method so the numbers line up.

Empty and error states render as centred in-table messages instead of a bare red line: the error keeps `role="alert"`, shows the raw message in a code chip, and offers Retry when `onRefresh` is set; the empty state offers Clear filters when a filter or search is active.

HTTP method, path, and status also fall back to Envoy/OTEL stream labels when the log Body is empty. Host prefers `requested_server_name` / `x_forwarded_host` / `authority`. Fixtures include a sanitised staging ALB `query_range` (`albQueryRangeFixture`).
