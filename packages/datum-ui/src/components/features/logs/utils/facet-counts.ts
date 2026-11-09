import type { LogFacet, LogFilters, LogTimeRange } from '../types'
import { buildLogQL } from './build-logql'
import { compareFacetValues, facetLabel } from './facets'

/** Same rule as `buildLogQL`: anything else can't be a Loki label. */
const LABEL_NAME = /^[a-z_]\w*$/i

export interface BuildLogFacetCountQueryOptions {
  /** Label to count values of, e.g. `response_code`. */
  label: string
  /**
   * Matchers that scope the page, e.g. `{ route_name: ['my-alb'] }`. Leave the
   * user's facet selections and search out: counting against the scope alone
   * keeps every option listed, with its total for the window, no matter what
   * is ticked.
   */
  matchers?: LogFilters
  /** Window to count over. Its length becomes the range selector. */
  timeRange: LogTimeRange
}

/** Whole seconds between `from` and `to`, at least 1. */
function rangeSeconds({ from, to }: LogTimeRange): number {
  const ms = new Date(to).getTime() - new Date(from).getTime()
  return Number.isFinite(ms) ? Math.max(1, Math.round(ms / 1000)) : 1
}

/**
 * LogQL that counts log lines per value of one label across a time range:
 *
 * ```
 * sum by (response_code) (count_over_time({route_name="my-alb"}[1800s]))
 * ```
 *
 * Run it as an instant query (`/loki/api/v1/query`) with `time` set to the
 * range's `to`, then pass the response to `facetFromLokiCounts`. Returns
 * `null` for a label name LogQL can't express. Works for indexed stream labels
 * and for structured metadata, which Loki can also group by.
 */
export function buildLogFacetCountQuery({ label, matchers, timeRange }: BuildLogFacetCountQueryOptions): string | null {
  if (!LABEL_NAME.test(label))
    return null
  return `sum by (${label}) (count_over_time(${buildLogQL({ matchers })}[${rangeSeconds(timeRange)}s]))`
}

/** One series of a Loki instant-query (`resultType: 'vector'`) response. */
export interface LokiVectorSample {
  metric: Record<string, string>
  value: [timestamp: number | string, value: string]
}

export interface LokiVectorResponse {
  status: 'success' | 'error'
  data?: {
    resultType: string
    result: LokiVectorSample[]
  }
  errorType?: string
  error?: string
}

/**
 * Turn the response to a `buildLogFacetCountQuery` query into a facet for
 * `Logs.Root`. Series without the label (lines that don't carry it) and zero
 * counts are skipped. Options are ordered the same way as `facetsFromEntries`.
 * Pass `label` to override the display name.
 */
export function facetFromLokiCounts(
  name: string,
  response: LokiVectorResponse | null | undefined,
  options: { label?: string } = {},
): LogFacet {
  const counts = new Map<string, number>()
  if (response?.status === 'success' && response.data?.resultType === 'vector') {
    for (const sample of response.data.result) {
      const value = sample.metric[name]
      const count = Number(sample.value?.[1])
      if (!value || !Number.isFinite(count) || count <= 0)
        continue
      counts.set(value, (counts.get(value) ?? 0) + Math.round(count))
    }
  }

  return {
    name,
    label: options.label ?? facetLabel(name),
    options: [...counts.entries()]
      .sort(([a], [b]) => compareFacetValues(name, a, b))
      .map(([value, count]) => ({ value, count })),
  }
}
