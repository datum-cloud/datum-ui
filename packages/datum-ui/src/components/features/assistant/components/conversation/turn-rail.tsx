'use client'

import type { Turn } from '../../types'
import { useState } from 'react'
import { cn } from '../../../../../utils/cn'

interface TurnRailProps {
  turns: Turn[]
  activeId: string | null
  onJump: (id: string) => void
}

/**
 * Right-edge rail: ticks (one per submitted prompt) when idle; morphs into a
 * compact, clickable prompt list on hover. The in-view turn is highlighted.
 */
export function TurnRail({ turns, activeId, onJump }: TurnRailProps) {
  const [open, setOpen] = useState(false)

  if (turns.length <= 1)
    return null

  return (
    <div
      className="absolute top-1/2 right-6 z-20 -translate-y-1/2"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {open
        ? (
            <div className="bg-card ring-border max-h-[65vh] w-64 overflow-y-auto rounded-xl p-1 shadow-lg ring-1">
              {turns.map(turn => (
                <button
                  key={turn.id}
                  type="button"
                  onClick={() => onJump(turn.id)}
                  className={cn(
                    'block w-full truncate rounded-md px-2.5 py-1.5 text-left text-xs transition-colors',
                    activeId === turn.id
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                  )}
                >
                  {turn.text || 'Untitled prompt'}
                </button>
              ))}
            </div>
          )
        : (
            <div className="flex max-h-[55vh] flex-col items-end gap-2 overflow-hidden">
              {turns.map(turn => (
                <span
                  key={turn.id}
                  className={cn(
                    'h-[3px] rounded-full transition-all',
                    activeId === turn.id ? 'bg-primary w-5' : 'bg-muted-foreground/30 w-3.5',
                  )}
                />
              ))}
            </div>
          )}
    </div>
  )
}
