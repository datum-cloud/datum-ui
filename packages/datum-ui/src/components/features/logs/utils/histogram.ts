import type { LogEntry, LogHistogramBucket, LogTimeRange } from '../types'
import { format } from 'date-fns'

export const DEFAULT_HISTOGRAM_BUCKETS = 60

const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

/**
 * Bucket `entries` into `bucketCount` equal-width bars across `range`.
 * Entries outside the range are ignored. Returns `[]` when the range is
 * invalid or empty so the timeline can fall back to an axis-only state.
 */
export function histogramFromEntries(
  entries: readonly LogEntry[],
  range: LogTimeRange,
  bucketCount = DEFAULT_HISTOGRAM_BUCKETS,
): LogHistogramBucket[] {
  const from = new Date(range.from).getTime()
  const to = new Date(range.to).getTime()
  if (Number.isNaN(from) || Number.isNaN(to) || to <= from || bucketCount < 1)
    return []

  const width = (to - from) / bucketCount
  const counts = Array.from<number>({ length: bucketCount }).fill(0)
  for (const entry of entries) {
    const at = entry.timestamp.getTime()
    if (at < from || at > to)
      continue
    // `to` itself lands in the final bucket instead of overflowing.
    const index = Math.min(Math.floor((at - from) / width), bucketCount - 1)
    counts[index]! += 1
  }

  return counts.map((count, index) => ({
    start: new Date(from + index * width).toISOString(),
    end: new Date(index === bucketCount - 1 ? to : from + (index + 1) * width).toISOString(),
    count,
  }))
}

/** Index of the bucket containing `date`, or `-1`. */
export function histogramBucketIndex(histogram: readonly LogHistogramBucket[], date: Date): number {
  const at = date.getTime()
  const last = histogram.length - 1
  return histogram.findIndex((bucket, index) => {
    const start = new Date(bucket.start).getTime()
    const end = new Date(bucket.end).getTime()
    return at >= start && (at < end || (index === last && at === end))
  })
}

/** Total span covered by a histogram, in ms. `0` when empty. */
export function histogramSpanMs(histogram: readonly LogHistogramBucket[]): number {
  const first = histogram[0]
  const last = histogram[histogram.length - 1]
  if (!first || !last)
    return 0
  return new Date(last.end).getTime() - new Date(first.start).getTime()
}

/** Axis tick label whose precision follows the span being displayed. */
export function formatTimelineTick(date: Date, spanMs: number): string {
  if (spanMs <= 2 * MINUTE_MS)
    return format(date, 'HH:mm:ss')
  if (spanMs < DAY_MS)
    return format(date, 'HH:mm')
  return format(date, 'MMM d HH:mm')
}

/** Tooltip text for a bucket: count plus its window. */
export function formatBucketSummary(bucket: LogHistogramBucket, spanMs: number): string {
  const start = new Date(bucket.start)
  const end = new Date(bucket.end)
  const widthMs = end.getTime() - start.getTime()
  // Sub-minute buckets need seconds precision regardless of the overall span.
  const tickSpan = widthMs < MINUTE_MS ? MINUTE_MS : spanMs
  const noun = bucket.count === 1 ? 'log' : 'logs'
  return `${bucket.count} ${noun} · ${formatTimelineTick(start, tickSpan)} – ${formatTimelineTick(end, tickSpan)}`
}
