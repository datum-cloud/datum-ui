import { LinkIcon, UnlinkIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Button } from '../../../base/button'
import { Input } from '../../../base/input'
import { ResponsivePopover } from '../../../base/responsive-popover'
import { Icon } from '../../../icons/icon-wrapper'
import { useRichTextEditor } from '../rich-text-editor'
import { ToolbarButton } from './toolbar-button'

function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed)
    return trimmed
  if (/^https?:\/\/|^mailto:/i.test(trimmed))
    return trimmed
  if (trimmed.includes('@') && !trimmed.includes(' '))
    return `mailto:${trimmed}`
  return `https://${trimmed}`
}

export function LinkToolbar() {
  const { editor } = useRichTextEditor()
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')

  const isActive = editor?.isActive('link')

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const href = normalizeUrl(url)
      if (!href)
        return
      editor?.chain().focus().extendMarkRange('link').setLink({ href }).run()
      setUrl('')
      setOpen(false)
    },
    [editor, url],
  )

  const handleUnlink = useCallback(() => {
    editor?.chain().focus().unsetLink().run()
  }, [editor])

  if (isActive) {
    return (
      <ToolbarButton active onClick={handleUnlink} tooltip="Remove link">
        <Icon icon={UnlinkIcon} className="size-4" />
      </ToolbarButton>
    )
  }

  // ToolbarButton uses onMouseDown+preventDefault to preserve editor selection.
  // We pass the trigger WITHOUT an onClick prop so that ResponsivePopover's
  // PopoverTrigger (asChild) owns the click event on desktop, while mousedown
  // still fires preventDefault to keep the text selection intact.
  // On mobile, ResponsivePopover renders a MobileSheet instead.
  return (
    <ResponsivePopover
      open={open}
      onOpenChange={setOpen}
      sheetTitle="Insert link"
      align="start"
      side="bottom"
      contentClassName="w-80 p-3"
      trigger={(
        <ToolbarButton tooltip="Add link" shortcut="&#8984;K">
          <Icon icon={LinkIcon} className="size-4" />
        </ToolbarButton>
      )}
    >
      <div className="p-4 sm:p-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="h-7 flex-1"
            autoFocus
          />
          <Button type="primary" size="xs" className="h-7" onClick={handleSubmit}>
            Add
          </Button>
        </form>
      </div>
    </ResponsivePopover>
  )
}
