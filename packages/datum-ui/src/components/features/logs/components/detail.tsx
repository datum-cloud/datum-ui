'use client'

import type { PointerEvent, ReactNode } from 'react'
import { ChevronDown, ChevronUp, Copy, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useRef, useState } from 'react'
import { useBreakpoint } from '../../../../hooks/use-breakpoint'
import { useCopyToClipboard } from '../../../../hooks/use-copy-to-clipboard'
import { cn } from '../../../../utils/cn'
import { Button } from '../../../base/button'
import { Sheet } from '../../../base/sheet'
import { Icon } from '../../../icons/icon-wrapper'
import { DateTime } from '../../date-time'
import { getBrowserTimezone, getTimezoneAbbreviation } from '../../date-time/formatters'
import { useLogs } from '../hooks/use-logs'
import { clampLogsDetailWidth, LOGS_DETAIL_MIN_WIDTH, logsDetailMaxWidth } from '../utils/detail-width'
import { formatLogTimestamp } from '../utils/format-timestamp'
import { logRequestHost } from '../utils/host'
import { formatHttpLogLine, parseLogLine, splitPathQuery } from '../utils/parse-log-line'
import { httpStatusTextClass } from '../utils/severity'
import { LogsHttpStatusChip, LogsSeverityBadge } from './status-badge'

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

/** Stable React keys for search params, which may repeat `key=value` verbatim. */
function keyedParams(params: ReadonlyArray<[string, string]>): Array<{ id: string, key: string, value: string }> {
  const seen = new Map<string, number>()
  return params.map(([key, value]) => {
    const pair = `${key}=${value}`
    const count = seen.get(pair) ?? 0
    seen.set(pair, count + 1)
    return { id: count === 0 ? pair : `${pair}#${count}`, key, value }
  })
}

function DetailBody({ showClose = true }: { showClose?: boolean }) {
  const { selectedEntry, selectPrevious, selectNext, setSelectedId } = useLogs()
  const [, copy] = useCopyToClipboard()

  if (!selectedEntry)
    return null

  const parsed = parseLogLine(selectedEntry.line, selectedEntry.labels)
  const displayLine = parsed.kind === 'http' && !selectedEntry.line.trim()
    ? formatHttpLogLine(parsed)
    : selectedEntry.line
  const request = splitPathQuery(parsed.kind === 'http' ? parsed.path : '')
  const title = parsed.kind === 'http'
    ? `${parsed.method} ${request.pathname}`
    : selectedEntry.labels.service_name ?? 'Log'
  const service = selectedEntry.labels.service_name ?? logRequestHost(selectedEntry.labels)

  return (
    <>
      <header className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="min-w-0 flex-1 truncate font-mono text-sm font-medium" title={title}>{title}</h3>
          {parsed.kind === 'http'
            ? <LogsHttpStatusChip status={parsed.status} />
            : <LogsSeverityBadge severity={selectedEntry.labels.severity} />}
          <div className="-my-1 flex shrink-0 items-center gap-1">
            <Button
              type="secondary"
              theme="borderless"
              size="icon"
              aria-label="Previous log"
              onClick={selectPrevious}
            >
              <Icon icon={ChevronUp} />
            </Button>
            <Button
              type="secondary"
              theme="borderless"
              size="icon"
              aria-label="Next log"
              onClick={selectNext}
            >
              <Icon icon={ChevronDown} />
            </Button>
            <Button
              type="secondary"
              theme="borderless"
              size="icon"
              aria-label="Copy log line"
              onClick={() => copy(displayLine, { withToast: true })}
            >
              <Icon icon={Copy} />
            </Button>
            {showClose && (
              <Button
                type="secondary"
                theme="borderless"
                size="icon"
                aria-label="Close details"
                onClick={() => setSelectedId(null)}
              >
                <Icon icon={X} />
              </Button>
            )}
          </div>
        </div>
        <div className="text-muted-foreground mt-1 flex min-w-0 flex-nowrap items-center gap-1.5 text-xs">
          {parsed.kind === 'http' && selectedEntry.labels.severity && (
            <>
              <LogsSeverityBadge severity={selectedEntry.labels.severity} />
              <span className="shrink-0" aria-hidden="true">·</span>
            </>
          )}
          {service && (
            <>
              <span className="min-w-0 truncate font-mono">{service}</span>
              <span className="shrink-0" aria-hidden="true">·</span>
            </>
          )}
          <DateTime
            date={selectedEntry.timestamp}
            timestamp={selectedEntry.timestampNs}
            variant="absolute"
            tooltip="detailed"
          >
            <time
              dateTime={selectedEntry.timestamp.toISOString()}
              data-slot="logs-detail-time"
              className="shrink-0 cursor-default font-mono whitespace-nowrap tabular-nums"
            >
              {formatLogTimestamp(selectedEntry.timestamp)}
              {' '}
              {getTimezoneAbbreviation(selectedEntry.timestamp, getBrowserTimezone())}
            </time>
          </DateTime>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        <section>
          <h4 className="text-muted-foreground mb-2 text-xs font-medium">Message</h4>
          <pre className="bg-muted text-foreground overflow-x-auto rounded-md border p-3 font-mono text-xs leading-5 whitespace-pre-wrap break-all">
            {displayLine}
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
              <MetaCell label="Path" className="col-span-3">{request.pathname}</MetaCell>
              {request.params.length > 0 && (
                <div className="bg-background col-span-3 min-w-0 px-3 py-2.5" data-slot="logs-search-params">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px] font-medium">Search params</span>
                    <Button
                      type="secondary"
                      theme="borderless"
                      size="icon"
                      className="-my-1 size-6"
                      aria-label="Copy search params"
                      onClick={() => copy(`?${request.search}`, { withToast: true })}
                    >
                      <Icon icon={Copy} size={14} />
                    </Button>
                  </div>
                  <dl className="flex flex-wrap gap-1.5">
                    {keyedParams(request.params).map(({ id, key, value }) => (
                      <div
                        key={id}
                        className="bg-muted/60 inline-flex max-w-full items-stretch overflow-hidden rounded-md border font-mono text-xs"
                      >
                        <dt className="text-muted-foreground border-r px-2 py-1">{key}</dt>
                        <dd className="min-w-0 truncate px-2 py-1" title={value}>{value || '—'}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
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

function LogsDetailResizeHandle({
  width,
  onWidthChange,
  panelRef,
}: {
  width: number
  onWidthChange: (width: number) => void
  panelRef: { current: HTMLElement | null }
}) {
  const dragRef = useRef<{ startX: number, startWidth: number } | null>(null)

  const onPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0)
      return
    event.preventDefault()
    dragRef.current = { startX: event.clientX, startWidth: width }
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [width])

  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current)
      return
    const next = dragRef.current.startWidth + (dragRef.current.startX - event.clientX)
    onWidthChange(clampLogsDetailWidth(next, logsDetailMaxWidth(panelRef.current)))
  }, [onWidthChange, panelRef])

  const onPointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
  }, [])

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize details"
      aria-valuemin={LOGS_DETAIL_MIN_WIDTH}
      aria-valuenow={width}
      data-slot="logs-detail-resize"
      tabIndex={0}
      className={cn(
        'absolute inset-y-0 left-0 z-10 w-3 -translate-x-1/2 cursor-ew-resize',
        'after:bg-transparent hover:after:bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2',
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 40 : 16
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          onWidthChange(clampLogsDetailWidth(width + step, logsDetailMaxWidth(panelRef.current)))
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          onWidthChange(clampLogsDetailWidth(width - step, logsDetailMaxWidth(panelRef.current)))
        }
        if (event.key === 'Home') {
          event.preventDefault()
          onWidthChange(LOGS_DETAIL_MIN_WIDTH)
        }
      }}
    />
  )
}

export function LogsDetail({ className }: { className?: string }) {
  const { selectedEntry, setSelectedId } = useLogs()
  const breakpoint = useBreakpoint()
  const reduceMotion = useReducedMotion()
  const isDesktop = breakpoint === 'desktop'
  const open = selectedEntry !== null
  const panelRef = useRef<HTMLElement>(null)
  const [width, setWidth] = useState(LOGS_DETAIL_MIN_WIDTH)

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
          ref={panelRef}
          data-slot="logs-detail"
          initial={reduceMotion ? false : { x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
          style={{ width }}
          className={cn(
            'bg-background absolute inset-y-0 right-0 z-20 flex h-full flex-col overflow-hidden border-l shadow-lg',
            className,
          )}
        >
          <LogsDetailResizeHandle width={width} onWidthChange={setWidth} panelRef={panelRef} />
          <DetailBody />
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
