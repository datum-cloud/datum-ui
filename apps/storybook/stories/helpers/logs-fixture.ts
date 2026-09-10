import type { LogEntry } from '@datum-cloud/datum-ui/logs'
import { flattenLokiStreams, logRequestHost } from '@datum-cloud/datum-ui/logs'
import { albQueryRangeFixture, queryRangeFixture } from '@datum-cloud/datum-ui/logs/fixtures'

/**
 * Recorded `query_range` fixtures span seconds, not the default 30-minute
 * window. Stretch them so they land in view and the timeline has bars.
 */
export function spreadOverLastMinutes(entries: readonly LogEntry[], minutes: number): LogEntry[] {
  if (entries.length === 0)
    return []
  const times = entries.map(entry => entry.timestamp.getTime())
  const min = Math.min(...times)
  const max = Math.max(...times)
  const span = Math.max(max - min, 1)
  const end = Date.now() - 30_000
  const start = end - minutes * 60_000

  return entries.map((entry) => {
    const ratio = (entry.timestamp.getTime() - min) / span
    const timestamp = new Date(start + ratio * (end - start))
    return {
      ...entry,
      timestamp,
      timestampNs: `${timestamp.getTime()}000000`,
    }
  })
}

function withRequestHost(entry: LogEntry): LogEntry {
  const host = logRequestHost(entry.labels)
  if (!host || entry.labels.host === host)
    return entry
  return { ...entry, labels: { ...entry.labels, host } }
}

export const logEntries = spreadOverLastMinutes(flattenLokiStreams(queryRangeFixture), 25)
export const albLogEntries = spreadOverLastMinutes(
  flattenLokiStreams(albQueryRangeFixture).map(withRequestHost),
  25,
)
