'use client'

import type { ReactNode } from 'react'
import { ChevronDown, ChevronUp, Copy, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useBreakpoint } from '../../../../hooks/use-breakpoint'
import { useCopyToClipboard } from '../../../../hooks/use-copy-to-clipboard'
import { cn } from '../../../../utils/cn'
import { Button } from '../../../base/button'
import { Sheet } from '../../../base/sheet'
import { DateTime } from '../../date-time'
import { useLogs } from '../hooks/use-logs'
import { parseLogLine } from '../utils/parse-log-line'
import { httpStatusTextClass } from '../utils/severity'
import { LogsSeverityBadge } from './status-badge'

function MetaCell({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('bg-background min-w-0 px-3 py-2.5', className)}>
      <div className="text-muted-foreground mb-1 text-[11px] font-medium">{label}</div>
      <div className="font-mono text-xs break-all">{children}</div>
    </div>
  )
}

function DetailBody({ showClose = true }: { showClose?: boolean }) {
  const { selectedEntry, selectPrevious, selectNext, setSelectedId } = useLogs()
  const [, copy] = useCopyToClipboard()

  if (!selectedEntry)
    return null

  const parsed = parseLogLine(selectedEntry.line)
  const title = parsed.kind === 'http'
    ? `${parsed.method} ${parsed.path}`
    : selectedEntry.labels.service_name ?? 'Log'
  const service = selectedEntry.labels.service_name

  return (
    <>
      <header className="flex items-start gap-2 border-b px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5">
            <LogsSeverityBadge severity={selectedEntry.labels.severity} />
          </div>
          <h3 className="truncate font-mono text-sm font-medium">{title}</h3>
          <div className="text-muted-foreground mt-1 flex min-w-0 items-center gap-1.5 text-xs">
            {service && (
              <>
                <span className="truncate font-mono">{service}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <DateTime
              date={selectedEntry.timestamp}
              timestamp={selectedEntry.timestampNs}
              variant="relative"
              tooltip="detailed"
              className="text-muted-foreground text-xs"
            />
          </div>
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

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        <section>
          <h4 className="text-muted-foreground mb-2 text-xs font-medium">Message</h4>
          <pre className="bg-muted text-foreground overflow-x-auto rounded-md border p-3 font-mono text-xs leading-5 whitespace-pre-wrap break-all">
            {selectedEntry.line}
          </pre>
        </section>

        {parsed.kind === 'http' && (
          <section>
            <h4 className="text-muted-foreground mb-2 text-xs font-medium">Request</h4>
            <div className="bg-border grid grid-cols-3 gap-px overflow-hidden rounded-md border">
              <MetaCell label="Method">{parsed.method}</MetaCell>
              <MetaCell label="Status">
                <span className={cn('font-medium tabular-nums', httpStatusTextClass(parsed.status))}>
                  {parsed.status}
                </span>
              </MetaCell>
              <MetaCell label="Duration">
                {parsed.durationMs}
                ms
              </MetaCell>
              <MetaCell label="Path" className="col-span-3">{parsed.path}</MetaCell>
            </div>
          </section>
        )}

        <section>
          <h4 className="text-muted-foreground mb-2 text-xs font-medium">Labels</h4>
          <dl className="overflow-hidden rounded-md border">
            {Object.entries(selectedEntry.labels).map(([key, value]) => (
              <div
                key={key}
                className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] gap-x-3 border-b px-3 py-2 last:border-b-0"
              >
                <dt className="text-muted-foreground truncate font-mono text-[11px]">{key}</dt>
                <dd className="min-w-0 font-mono text-xs break-all">{value}</dd>
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
  const reduceMotion = useReducedMotion()
  const isDesktop = breakpoint === 'desktop'
  const open = selectedEntry !== null

  if (!isDesktop) {
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
          showCloseButton={false}
          className="sm:max-w-md w-full gap-0 p-0"
          data-slot="logs-detail"
        >
          <Sheet.Title className="sr-only">Log details</Sheet.Title>
          <Sheet.Description className="sr-only">Selected log entry</Sheet.Description>
          <div className="flex h-full flex-col">
            <DetailBody />
          </div>
        </Sheet.Content>
      </Sheet>
    )
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          data-slot="logs-detail"
          initial={reduceMotion ? false : { width: 0 }}
          animate={{ width: 400 }}
          exit={{ width: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
          className={cn('bg-background flex h-full shrink-0 flex-col overflow-hidden border-l', className)}
        >
          <div className="flex h-full w-[400px] flex-col">
            <DetailBody />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
