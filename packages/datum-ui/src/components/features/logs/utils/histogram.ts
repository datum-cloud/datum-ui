import type { LogEntry, LogHistogramBucket, LogTimeRange } from '../types'
import { HISTOGRAM_BUCKET_COUNT } from './constants'

function rangeBounds(
  entries: readonly LogEntry[],
  timeRange?: LogTimeRange,
): { start: number, end: number } | null {
  if (timeRange) {
    const start = new Date(timeRange.from).getTime()
    const end = new Date(timeRange.to).getTime()
    if (!Number.isNaN(start) && !Number.isNaN(end) && end > start)
      return { start, end }
  }

  if (entries.length === 0)
    return null

  let min = entries[0]!.timestamp.getTime()
  let max = min
  for (const entry of entries) {
    const t = entry.timestamp.getTime()
    if (t < min)
      min = t
    if (t > max)
      max = t
  }
  if (max <= min)
    max = min + 1000
  return { start: min, end: max }
}

export function histogramFromEntries(
  entries: readonly LogEntry[],
  timeRange?: LogTimeRange,
  bucketCount = HISTOGRAM_BUCKET_COUNT,
): LogHistogramBucket[] {
  const bounds = rangeBounds(entries, timeRange)
  if (!bounds)
    return []

  const count = Math.max(1, bucketCount)
  const width = (bounds.end - bounds.start) / count
  const buckets: LogHistogramBucket[] = Array.from({ length: count }, (_, i) => ({
    timestamp: new Date(bounds.start + i * width),
    count: 0,
  }))

  for (const entry of entries) {
    const t = entry.timestamp.getTime()
    if (t < bounds.start || t > bounds.end)
      continue
    const index = Math.min(count - 1, Math.max(0, Math.floor((t - bounds.start) / width)))
    const bucket = buckets[index]
    if (bucket)
      bucket.count += 1
  }

  return buckets
}
