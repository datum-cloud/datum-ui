'use client'

import type { ChartConfig, CustomTooltipProps } from '../../../base/chart'
import { Bar, BarChart, XAxis } from 'recharts'
import { cn } from '../../../../utils/cn'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../../base/chart'
import { useLogs } from '../hooks/use-logs'
import { formatLogTimestamp } from '../utils/format-timestamp'

const chartConfig = {
  count: {
    label: 'Logs',
    color: 'var(--color-muted-foreground)',
  },
} satisfies ChartConfig

interface TimelinePoint {
  index: number
  timestamp: string
  label: string
  count: number
}

export function LogsTimeline({ className }: { className?: string }) {
  const { histogram, setTimeRange } = useLogs()

  if (histogram.length === 0)
    return null

  const data: TimelinePoint[] = histogram.map((bucket, index) => ({
    index,
    timestamp: bucket.timestamp.toISOString(),
    label: formatLogTimestamp(bucket.timestamp),
    count: bucket.count,
  }))

  function selectBucket(point: TimelinePoint) {
    const start = new Date(point.timestamp)
    const next = histogram[point.index + 1]?.timestamp
    const end = next ?? new Date(start.getTime() + 60_000)
    setTimeRange({ from: start.toISOString(), to: end.toISOString() })
  }

  return (
    <div data-slot="logs-timeline" className={cn('border-b px-3 py-2', className)}>
      <ChartContainer config={chartConfig} className="aspect-auto h-14 w-full">
        <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="label" hide />
          <ChartTooltip
            content={props => <ChartTooltipContent {...(props as CustomTooltipProps)} />}
          />
          <Bar
            dataKey="count"
            fill="var(--color-count)"
            radius={1}
            maxBarSize={8}
            cursor="pointer"
            onClick={(point) => {
              const payload = point as unknown as TimelinePoint
              if (payload?.timestamp)
                selectBucket(payload)
            }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
