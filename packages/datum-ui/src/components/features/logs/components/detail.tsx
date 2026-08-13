'use client'

import { ChevronDown, ChevronUp, Copy, X } from 'lucide-react'
import { useBreakpoint } from '../../../../hooks/use-breakpoint'
import { useCopyToClipboard } from '../../../../hooks/use-copy-to-clipboard'
import { cn } from '../../../../utils/cn'
import { Button } from '../../../base/button'
import { Separator } from '../../../base/separator'
import { Sheet } from '../../../base/sheet'
import { useLogs } from '../hooks/use-logs'
import {
  formatLocalTimestamp,
  formatRelativeTimestamp,
  formatUtcTimestamp,
} from '../utils/format-timestamp'
import { parseLogLine } from '../utils/parse-log-line'
import { LogsStatusBadge } from './status-badge'

function DetailBody({ showClose = true }: { showClose?: boolean }) {
  const { selectedEntry, selectPrevious, selectNext, setSelectedId } = useLogs()
  const [, copy] = useCopyToClipboard()

  if (!selectedEntry)
    return null

  const parsed = parseLogLine(selectedEntry.line)
  const title = parsed.kind === 'http'
    ? `${parsed.method} ${parsed.path}`
    : selectedEntry.labels.service_name ?? 'Log'

  return (
    <>
      <header className="flex items-start gap-2 border-b px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <LogsStatusBadge severity={selectedEntry.labels.severity} parsed={parsed} />
            <span className="text-muted-foreground truncate font-mono text-xs">
              {selectedEntry.labels.service_name}
            </span>
          </div>
          <h3 className="truncate font-mono text-sm font-medium">{title}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="secondary"
            theme="borderless"
            size="icon"
            aria-label="Previous log"
            onClick={selectPrevious}
          >
            <ChevronUp className="size-4" />
          </Button>
          <Button
            type="secondary"
            theme="borderless"
            size="icon"
            aria-label="Next log"
            onClick={selectNext}
          >
            <ChevronDown className="size-4" />
          </Button>
          <Button
            type="secondary"
            theme="borderless"
            size="icon"
            aria-label="Copy log line"
            onClick={() => copy(selectedEntry.line, { withToast: true })}
          >
            <Copy className="size-4" />
          </Button>
          {showClose && (
            <Button
              type="secondary"
              theme="borderless"
              size="icon"
              aria-label="Close details"
              onClick={() => setSelectedId(null)}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <section className="mb-4">
          <h4 className="text-muted-foreground mb-1 text-xs font-medium">Time</h4>
          <p className="text-sm">{formatRelativeTimestamp(selectedEntry.timestamp)}</p>
          <p className="text-muted-foreground font-mono text-xs">
            {formatUtcTimestamp(selectedEntry.timestamp)}
          </p>
          <p className="text-muted-foreground font-mono text-xs">
            {formatLocalTimestamp(selectedEntry.timestamp)}
          </p>
        </section>

        {parsed.kind === 'http' && (
          <section className="mb-4">
            <h4 className="text-muted-foreground mb-2 text-xs font-medium">Request</h4>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              <dt className="text-muted-foreground">Method</dt>
              <dd className="font-mono text-xs">{parsed.method}</dd>
              <dt className="text-muted-foreground">Path</dt>
              <dd className="font-mono text-xs">{parsed.path}</dd>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-mono text-xs">{parsed.status}</dd>
              <dt className="text-muted-foreground">Duration</dt>
              <dd className="font-mono text-xs">
                {parsed.durationMs}
                ms
              </dd>
            </dl>
          </section>
        )}

        <section className="mb-4">
          <h4 className="text-muted-foreground mb-2 text-xs font-medium">Message</h4>
          <pre className="bg-muted/40 overflow-x-auto rounded-md p-3 font-mono text-xs whitespace-pre-wrap">
            {selectedEntry.line}
          </pre>
        </section>

        <Separator className="mb-4" />

        <section>
          <h4 className="text-muted-foreground mb-2 text-xs font-medium">Labels</h4>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            {Object.entries(selectedEntry.labels).map(([key, value]) => (
              <div key={key} className="contents">
                <dt className="text-muted-foreground font-mono text-xs">{key}</dt>
                <dd className="font-mono text-xs">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  )
}

export function LogsDetail({ className }: { className?: string }) {
  const { selectedEntry, setSelectedId } = useLogs()
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'mobile'
  const open = selectedEntry !== null

  if (isMobile) {
    return (
      <Sheet
        open={open}
        onOpenChange={(next) => {
          if (!next)
            setSelectedId(null)
        }}
      >
        <Sheet.Content
          side="right"
          className="sm:max-w-md w-full gap-0 p-0"
          data-slot="logs-detail"
        >
          <Sheet.Title className="sr-only">Log details</Sheet.Title>
          <Sheet.Description className="sr-only">Selected log entry</Sheet.Description>
          <div className="flex h-full flex-col">
            <DetailBody showClose={false} />
          </div>
        </Sheet.Content>
      </Sheet>
    )
  }

  if (!open)
    return null

  return (
    <aside
      data-slot="logs-detail"
      className={cn('bg-background flex h-full w-[400px] shrink-0 flex-col border-l', className)}
    >
      <DetailBody />
    </aside>
  )
}
