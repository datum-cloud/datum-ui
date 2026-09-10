'use client'

import { useMemo } from 'react'
import { cn } from '../../../../utils/cn'
import { Skeleton } from '../../../base/skeleton'
import { useLogs } from '../hooks/use-logs'
import {
  DEFAULT_HISTOGRAM_BUCKETS,
  formatBucketSummary,
  formatTimelineTick,
  histogramBucketIndex,
  histogramSpanMs,
} from '../utils/histogram'

const SKELETON_HEIGHTS = [18, 34, 22, 48, 30, 60, 26, 40, 20, 52, 36, 28] as const

function TimelineSkeleton() {
  return (
    <div
      data-slot="logs-timeline-skeleton"
      className="flex h-10 items-end gap-px"
      aria-hidden
    >
      {Array.from({ length: DEFAULT_HISTOGRAM_BUCKETS }, (_, index) => (
        <Skeleton
          key={index}
          className="min-w-0 flex-1 rounded-[1px]"
          style={{ height: `${SKELETON_HEIGHTS[index % SKELETON_HEIGHTS.length]}%` }}
        />
      ))}
    </div>
  )
}

export function LogsTimeline({ className }: { className?: string }) {
  const { histogram, isLoading, selectedEntry, timeRange } = useLogs()

  const spanMs = histogramSpanMs(histogram)
  const max = useMemo(
    () => histogram.reduce((peak, bucket) => Math.max(peak, bucket.count), 0),
    [histogram],
  )
  const total = useMemo(
    () => histogram.reduce((sum, bucket) => sum + bucket.count, 0),
    [histogram],
  )
  const selectedIndex = selectedEntry ? histogramBucketIndex(histogram, selectedEntry.timestamp) : -1
  // Tooltip text only changes with the data, not with selection or hover.
  const titles = useMemo(
    () => histogram.map(bucket => formatBucketSummary(bucket, spanMs)),
    [histogram, spanMs],
  )

  const from = histogram[0] ? new Date(histogram[0].start) : new Date(timeRange.from)
  const to = histogram.length > 0 ? new Date(histogram[histogram.length - 1]!.end) : new Date(timeRange.to)
  const axisSpan = spanMs > 0 ? spanMs : to.getTime() - from.getTime()
  const mid = new Date((from.getTime() + to.getTime()) / 2)
  const showSkeleton = isLoading && histogram.length === 0

  return (
    <div
      data-slot="logs-timeline"
      className={cn('border-b px-3 pt-2 pb-1', className)}
    >
      {showSkeleton
        ? <TimelineSkeleton />
        : (
            <div
              role="img"
              aria-label={`${total} logs between ${formatTimelineTick(from, axisSpan)} and ${formatTimelineTick(to, axisSpan)}`}
              className="flex h-10 items-end gap-px"
            >
              {histogram.map((bucket, index) => {
                const height = max > 0 ? (bucket.count / max) * 100 : 0
                const selected = index === selectedIndex
                return (
                  <div
                    key={bucket.start}
                    title={titles[index]}
                    data-slot="logs-timeline-bucket"
                    data-selected={selected || undefined}
                    className="relative flex h-full min-w-0 flex-1 items-end"
                  >
                    <div
                      className={cn(
                        'w-full rounded-[1px] transition-colors',
                        bucket.count > 0 ? 'bg-foreground/30 hover:bg-foreground/50' : 'bg-foreground/[0.06]',
                        selected && 'bg-primary hover:bg-primary',
                      )}
                      style={{ height: bucket.count > 0 ? `max(${height}%, 2px)` : '1px' }}
                    />
                  </div>
                )
              })}
            </div>
          )}
      <div className="text-muted-foreground mt-1 flex justify-between font-mono text-[10px] tabular-nums">
        <span>{formatTimelineTick(from, axisSpan)}</span>
        <span>{formatTimelineTick(mid, axisSpan)}</span>
        <span>{formatTimelineTick(to, axisSpan)}</span>
      </div>
    </div>
  )
}
