'use client'

import { MessagesSquare, Plus } from 'lucide-react'
import { cn } from '../../../../../utils/cn'
import { Tooltip } from '../../../../base/tooltip'
import { Icon } from '../../../../icons/icon-wrapper'

interface ChatRailProps {
  historyOpen: boolean
  onNewChat: () => void
  onToggleHistory: () => void
}

export function ChatRail({ historyOpen, onNewChat, onToggleHistory }: ChatRailProps) {
  // Same treatment as the Milo sub-nav rail: transparent base, white pill
  // (--card) on hover/active with primary-coloured icon.
  const iconClass
    = 'text-foreground hover:bg-card hover:text-primary flex size-9 items-center justify-center rounded-md border border-transparent transition-colors'

  return (
    <div className="bg-background flex w-12 shrink-0 flex-col items-center gap-1 border-r py-3">
      <Tooltip message="New chat" side="right">
        <button
          type="button"
          aria-label="New chat"
          onClick={onNewChat}
          className={cn(iconClass, 'group')}
        >
          <span className="bg-foreground text-background group-hover:bg-primary flex size-4 items-center justify-center rounded-full transition-colors">
            <Plus className="size-3" strokeWidth={2.5} />
          </span>
        </button>
      </Tooltip>
      <Tooltip message="Chats" side="right">
        <button
          type="button"
          aria-label="Chats"
          onClick={onToggleHistory}
          className={cn(iconClass, historyOpen && 'bg-card text-primary')}
        >
          <Icon icon={MessagesSquare} />
        </button>
      </Tooltip>
    </div>
  )
}
