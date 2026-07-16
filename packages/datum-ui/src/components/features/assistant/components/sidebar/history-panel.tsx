'use client'

import type { ChatSummary } from '../../types'
import { isTextUIPart } from 'ai'
import { Download, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '../../../../../utils/cn'
import { Tooltip } from '../../../../base/tooltip'
import { formatRelativeTime } from '../../utils'

function downloadChat(chat: ChatSummary) {
  const lines = chat.messages.map((msg) => {
    const role = msg.role === 'user' ? 'You' : 'Assistant'
    const text = msg.parts
      .filter(isTextUIPart)
      .map(p => p.text)
      .join('\n')
    return `## ${role}\n\n${text}`
  })
  const markdown = `# ${chat.title}\n\n${lines.join('\n\n---\n\n')}\n`
  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${chat.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.md`
  a.click()
  URL.revokeObjectURL(url)
}

interface HistoryPanelProps {
  chatList: ChatSummary[]
  currentChatId: string
  onLoadChat: (chat: ChatSummary) => void
  onDeleteChat: (e: React.MouseEvent, chatId: string) => void
}

export function HistoryPanel({
  chatList,
  currentChatId,
  onLoadChat,
  onDeleteChat,
}: HistoryPanelProps) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? chatList.filter(c => c.title.toLowerCase().includes(q)) : chatList
  }, [chatList, query])

  return (
    <div className="bg-background flex h-full w-64 shrink-0 flex-col border-r">
      <div className="flex h-12 items-center border-b px-2">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search chats…"
          className="bg-muted text-foreground placeholder:text-muted-foreground/70 focus:ring-primary/40 w-full rounded-md px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
        />
      </div>

      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
        {filtered.length === 0
          ? (
              <p className="text-muted-foreground/60 px-2 py-1 text-xs">
                {query ? 'No matching chats' : 'No saved chats'}
              </p>
            )
          : (
              filtered.map(chat => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => onLoadChat(chat)}
                  className={cn(
                    'group w-full rounded-lg px-2 py-1.5 text-left transition-colors',
                    chat.id === currentChatId
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                  )}
                >
                  <span className="flex items-center gap-1">
                    <span className="min-w-0 flex-1 truncate text-xs font-medium">{chat.title}</span>
                    <span
                      role="button"
                      onClick={e => onDeleteChat(e, chat.id)}
                      aria-label="Delete chat"
                      className="text-muted-foreground/40 hover:text-destructive shrink-0 rounded p-0.5 opacity-0 transition-colors group-hover:opacity-100"
                    >
                      <Trash2 className="size-3" />
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-muted-foreground/60 text-[10px]">
                      {formatRelativeTime(chat.updatedAt)}
                    </span>
                    <Tooltip message="Download as Markdown" side="top">
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadChat(chat)
                        }}
                        aria-label="Download chat as Markdown"
                        className="text-muted-foreground/40 hover:text-foreground shrink-0 rounded p-0.5 opacity-0 transition-colors group-hover:opacity-100"
                      >
                        <Download className="size-3" />
                      </span>
                    </Tooltip>
                  </span>
                </button>
              ))
            )}
      </div>
      <p className="text-muted-foreground mt-auto shrink-0 border-t px-3 py-2 text-[10px]">
        Chats are saved to your browser&apos;s local storage.
      </p>
    </div>
  )
}
