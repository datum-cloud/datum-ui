'use client'

import type { ReactNode } from 'react'
import type { ChatSummary } from '../../types'
import { isTextUIPart } from 'ai'
import { Archive, ArchiveRestore, Download, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '../../../../../utils/cn'
import { Button } from '../../../../base/button'
import { Dialog } from '../../../../base/dialog'
import { Tooltip } from '../../../../base/tooltip'
import { Icon } from '../../../../icons/icon-wrapper'
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

export interface HistoryPanelProps {
  chatList: ChatSummary[]
  currentChatId: string
  onLoadChat: (chat: ChatSummary) => void
  onDeleteChat: (e: React.MouseEvent, chatId: string) => void
  /**
   * Opt-in archive support. When provided, `chatList` may mix archived and
   * active chats: the panel lists active chats by default, adds an "Archived"
   * view toggle next to the search input, and gives active rows an archive
   * action. When omitted, the `archived` flag is ignored and no archive UI renders.
   */
  onArchiveChat?: (e: React.MouseEvent, chatId: string) => void
  /** Restores an archived chat. Rendered on rows in the archived view. */
  onUnarchiveChat?: (e: React.MouseEvent, chatId: string) => void
  /**
   * Ask for confirmation (deletion can't be undone) before calling
   * `onDeleteChat`. Defaults to false, which deletes immediately.
   */
  confirmDelete?: boolean
  /**
   * Optional host-supplied block pinned above the search input, naming the scope
   * the listed chats belong to — cloud-portal shows the current project. Hosts
   * whose history isn't scoped to anything (staff-portal) omit it.
   */
  header?: ReactNode
}

const ROW_ACTION_CLASS
  = 'text-muted-foreground/40 shrink-0 rounded p-0.5 opacity-0 transition-colors group-hover:opacity-100'

export function HistoryPanel({
  chatList,
  currentChatId,
  onLoadChat,
  onDeleteChat,
  onArchiveChat,
  onUnarchiveChat,
  confirmDelete = false,
  header,
}: HistoryPanelProps) {
  const archiveEnabled = Boolean(onArchiveChat)
  const [query, setQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<ChatSummary | null>(null)
  const inArchivedView = archiveEnabled && showArchived

  const filtered = useMemo(() => {
    const inView = archiveEnabled
      ? chatList.filter(c => Boolean(c.archived) === showArchived)
      : chatList
    const q = query.trim().toLowerCase()
    return q ? inView.filter(c => c.title.toLowerCase().includes(q)) : inView
  }, [archiveEnabled, chatList, query, showArchived])

  const emptyText = inArchivedView
    ? (query ? 'No matching archived chats' : 'No archived chats')
    : (query ? 'No matching chats' : 'No saved chats')

  const handleDelete = (e: React.MouseEvent, chat: ChatSummary) => {
    if (!confirmDelete) {
      onDeleteChat(e, chat.id)
      return
    }
    e.stopPropagation()
    setPendingDelete(chat)
  }

  return (
    <div className="bg-background flex h-full w-64 shrink-0 flex-col border-r">
      {header && <div className="shrink-0 border-b px-3 py-2">{header}</div>}

      <div className="flex h-12 items-center gap-1 border-b px-2">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={inArchivedView ? 'Search archived chats…' : 'Search chats…'}
          className="bg-muted text-foreground placeholder:text-muted-foreground/70 focus:ring-primary/40 w-full rounded-md px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
        />
        {archiveEnabled && (
          <Tooltip message={showArchived ? 'Show active chats' : 'Show archived chats'} side="bottom">
            <button
              type="button"
              aria-label="Archived"
              aria-pressed={showArchived}
              onClick={() => setShowArchived(v => !v)}
              className={cn(
                'shrink-0 rounded-md p-1.5 transition-colors',
                showArchived
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
              )}
            >
              <Icon icon={Archive} className="size-3.5" />
            </button>
          </Tooltip>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
        {filtered.length === 0
          ? (
              <p className="text-muted-foreground/60 px-2 py-1 text-xs">
                {emptyText}
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
                    {archiveEnabled && !inArchivedView && (
                      <Tooltip message="Archive chat" side="top">
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onArchiveChat?.(e, chat.id)
                          }}
                          aria-label="Archive chat"
                          className={cn(ROW_ACTION_CLASS, 'hover:text-foreground')}
                        >
                          <Icon icon={Archive} className="size-3" />
                        </span>
                      </Tooltip>
                    )}
                    {inArchivedView && onUnarchiveChat && (
                      <Tooltip message="Unarchive chat" side="top">
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onUnarchiveChat(e, chat.id)
                          }}
                          aria-label="Unarchive chat"
                          className={cn(ROW_ACTION_CLASS, 'hover:text-foreground')}
                        >
                          <Icon icon={ArchiveRestore} className="size-3" />
                        </span>
                      </Tooltip>
                    )}
                    <span
                      role="button"
                      onClick={e => handleDelete(e, chat)}
                      aria-label="Delete chat"
                      className={cn(ROW_ACTION_CLASS, 'hover:text-destructive')}
                    >
                      <Icon icon={Trash2} className="size-3" />
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-muted-foreground/60 text-4xs">
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
                        className={cn(ROW_ACTION_CLASS, 'hover:text-foreground')}
                      >
                        <Icon icon={Download} className="size-3" />
                      </span>
                    </Tooltip>
                  </span>
                </button>
              ))
            )}
      </div>
      <p className="text-muted-foreground mt-auto shrink-0 border-t px-3 py-2 text-4xs">
        Chats are saved to your browser&apos;s local storage.
      </p>

      {/* Rendered outside the row buttons so clicks in the (portaled) dialog
          don't bubble through React's tree into a row's onLoadChat. */}
      {confirmDelete && (
        <Dialog open={pendingDelete !== null} onOpenChange={open => !open && setPendingDelete(null)}>
          <Dialog.Content className="sm:max-w-md">
            <Dialog.Header
              title="Delete chat?"
              description={
                pendingDelete
                  ? `"${pendingDelete.title}" will be permanently deleted. This can't be undone.`
                  : undefined
              }
            />
            <Dialog.Footer className="border-t-0">
              <Button type="tertiary" theme="outline" onClick={() => setPendingDelete(null)}>
                Cancel
              </Button>
              <Button
                type="danger"
                theme="solid"
                onClick={(e) => {
                  if (pendingDelete)
                    onDeleteChat(e, pendingDelete.id)
                  setPendingDelete(null)
                }}
              >
                Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      )}
    </div>
  )
}
