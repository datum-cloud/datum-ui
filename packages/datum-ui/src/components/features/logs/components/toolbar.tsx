'use client'

import type { ReactNode } from 'react'
import { Download, RefreshCw, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../../../../utils/cn'
import { Button } from '../../../base/button'
import { Input } from '../../../base/input'
import { useLogs } from '../hooks/use-logs'

export function LogsSearch({
  placeholder = 'Search logs...',
  className,
}: {
  placeholder?: string
  className?: string
}) {
  const { search, setSearch } = useLogs()
  const [value, setValue] = useState(search)
  const searchRef = useRef(search)
  const skipNextSync = useRef(false)
  searchRef.current = search

  useEffect(() => {
    if (skipNextSync.current) {
      skipNextSync.current = false
      return
    }
    setValue(search)
  }, [search])

  useEffect(() => {
    if (value === searchRef.current)
      return
    const timer = setTimeout(() => {
      skipNextSync.current = true
      setSearch(value)
    }, 250)
    return () => clearTimeout(timer)
  }, [value, setSearch])

  return (
    <div className={cn('relative min-w-0 flex-1', className)}>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        value={value}
        onChange={event => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-9"
        data-slot="logs-search"
      />
    </div>
  )
}

export function LogsLiveToggle({ className }: { className?: string }) {
  const { live, setLive } = useLogs()

  return (
    <Button
      type="secondary"
      theme="outline"
      size="small"
      aria-pressed={live}
      onClick={() => setLive(!live)}
      className={cn('gap-2', className)}
      data-slot="logs-live"
    >
      <span
        className={cn(
          'size-2 rounded-full',
          live ? 'bg-destructive animate-pulse' : 'bg-muted-foreground/40',
        )}
      />
      Live
    </Button>
  )
}

export function LogsToolbar({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  const { onRefresh, onExport, entries } = useLogs()

  return (
    <div
      data-slot="logs-toolbar"
      className={cn('flex items-center gap-2 border-b px-3 py-2', className)}
    >
      <LogsSearch />
      {children}
      <LogsLiveToggle />
      {onRefresh && (
        <Button
          type="secondary"
          theme="outline"
          size="icon"
          aria-label="Refresh logs"
          onClick={onRefresh}
        >
          <RefreshCw className="size-4" />
        </Button>
      )}
      {onExport && (
        <Button
          type="secondary"
          theme="outline"
          size="icon"
          aria-label="Export logs"
          onClick={() => onExport(entries)}
        >
          <Download className="size-4" />
        </Button>
      )}
    </div>
  )
}
