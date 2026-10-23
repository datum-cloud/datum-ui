'use client'

import type { LucideIcon } from 'lucide-react'
import type { AssistantChoiceOption, AssistantChoicesData } from '../../types'
import { Box, Check, Clock, Database, Globe, Laptop, Link, MapPin, Network, Server, Shield } from 'lucide-react'
import { cn } from '../../../../../utils/cn'
import { Icon } from '../../../../icons/icon-wrapper'

const CHOICE_ICONS: Record<string, LucideIcon> = {
  clock: Clock,
  container: Box,
  database: Database,
  domain: Link,
  globe: Globe,
  laptop: Laptop,
  location: MapPin,
  network: Network,
  server: Server,
  shield: Shield,
}

export interface AssistantChoiceChipsProps {
  data: AssistantChoicesData
  /**
   * Called with the option the person picked. Omit it, or pass `disabled`,
   * for a question that can no longer be answered (an earlier turn, or one
   * answered by typing instead).
   */
  onChoose?: (option: AssistantChoiceOption) => void
  disabled?: boolean
}

/**
 * A pick-one question as a row of buttons. Once an option is picked it stays
 * marked with a check and the others fade, so a scrolled-back conversation
 * still shows what was chosen.
 */
export function AssistantChoiceChips({ data, onChoose, disabled = false }: AssistantChoiceChipsProps) {
  const answered = data.selectedId !== undefined
  const interactive = !answered && !disabled && onChoose !== undefined

  return (
    <div className="my-1 space-y-2" data-slot="assistant-choices">
      <p className="font-medium">{data.question}</p>
      <div role="group" aria-label={data.question} className="flex flex-wrap gap-2">
        {data.options.map((option) => {
          const selected = option.id === data.selectedId
          const icon = option.icon ? CHOICE_ICONS[option.icon] : undefined
          return (
            <button
              key={option.id}
              type="button"
              disabled={!interactive}
              aria-pressed={answered ? selected : undefined}
              onClick={() => onChoose?.(option)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                selected && 'border-btn-primary text-btn-primary bg-btn-primary/5',
                !selected && answered && 'text-muted-foreground/60 border-border/60',
                !selected && !answered && 'text-foreground border-border',
                interactive ? 'hover:bg-accent cursor-pointer' : 'cursor-default',
                !answered && !interactive && 'opacity-60',
              )}
            >
              {selected
                ? <Icon icon={Check} className="size-3.5 shrink-0" />
                : icon && <Icon icon={icon} className="size-3.5 shrink-0" />}
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
