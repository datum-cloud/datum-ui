'use client'

import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useBreakpoint } from '../../../../hooks/use-breakpoint'
import { cn } from '../../../../utils/cn'
import { Button } from '../../../base/button'
import { Sheet } from '../../../base/sheet'
import { LogsDetail } from './detail'
import { LogsFilters } from './filters'
import { LogsTable } from './table'
import { LogsToolbar } from './toolbar'

export function LogsExplorer({ className }: { className?: string }) {
  const breakpoint = useBreakpoint()
  const isDesktop = breakpoint === 'desktop'
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div
      data-slot="logs-explorer"
      className={cn('flex min-h-0 flex-1 overflow-hidden', className)}
    >
      {isDesktop
        ? <LogsFilters />
        : (
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <Sheet.Content side="left" className="w-72 p-0 sm:max-w-72">
                <Sheet.Title className="sr-only">Filters</Sheet.Title>
                <Sheet.Description className="sr-only">Log filters</Sheet.Description>
                <LogsFilters className="w-full border-r-0 [&>div:first-child]:pr-12" />
              </Sheet.Content>
            </Sheet>
          )}

      <div className="flex min-w-0 flex-1 flex-col">
        <LogsToolbar>
          {!isDesktop && (
            <Button
              type="secondary"
              theme="outline"
              size="small"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal className="size-4" />
              Filters
            </Button>
          )}
        </LogsToolbar>
        <div className="flex min-h-0 flex-1">
          <LogsTable />
          {isDesktop && <LogsDetail />}
        </div>
      </div>

      {!isDesktop && <LogsDetail />}
    </div>
  )
}
