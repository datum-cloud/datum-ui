'use client'

import type { EffortId } from '../../types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/shadcn/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { useAssistantConfig } from '../../context'

interface ModelSelectorProps {
  modelId: string
  effortId: EffortId
  onModelChange: (id: string) => void
  onEffortChange: (id: EffortId) => void
  disabled?: boolean
}

export function ModelSelector({
  modelId,
  effortId,
  onModelChange,
  onEffortChange,
  disabled,
}: ModelSelectorProps) {
  const { modelSelector } = useAssistantConfig()
  if (!modelSelector)
    return null
  const { models, efforts } = modelSelector
  const model = models.find(m => m.id === modelId) ?? models[0]
  const effort = efforts.find(e => e.id === effortId) ?? efforts[0]
  if (!model || !effort)
    return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          aria-label="Select model and effort"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs transition-colors disabled:opacity-50"
        >
          <span className="text-foreground font-medium">{model.label}</span>
          <span>{effort.label}</span>
          <ChevronDown className="size-3.5 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        collisionPadding={16}
        className="flex w-56 max-h-[min(24rem,var(--radix-dropdown-menu-content-available-height))] flex-col overflow-hidden"
      >
        <DropdownMenuLabel className="text-muted-foreground shrink-0 text-[10px] tracking-wide uppercase">
          Model
        </DropdownMenuLabel>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <DropdownMenuRadioGroup value={modelId} onValueChange={onModelChange}>
            {models.map(m => (
              <DropdownMenuRadioItem key={m.id} value={m.id} className="text-sm">
                {m.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </div>
        <DropdownMenuSeparator className="shrink-0" />
        <DropdownMenuLabel className="text-muted-foreground shrink-0 text-[10px] tracking-wide uppercase">
          Effort
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={effortId}
          onValueChange={v => onEffortChange(v as EffortId)}
          className="shrink-0"
        >
          {efforts.map(e => (
            <DropdownMenuRadioItem key={e.id} value={e.id} className="text-sm">
              {e.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
