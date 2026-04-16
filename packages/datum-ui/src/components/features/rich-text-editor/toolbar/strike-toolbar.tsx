import { StrikethroughIcon } from 'lucide-react'
import { useRichTextEditor } from '../rich-text-editor'
import { ToolbarButton } from './toolbar-button'

export function StrikeToolbar() {
  const { editor } = useRichTextEditor()
  return (
    <ToolbarButton
      active={editor?.isActive('strike')}
      disabled={!editor?.can().toggleStrike()}
      onClick={() => editor?.chain().focus().toggleStrike().run()}
      tooltip="Strikethrough"
      shortcut="&#8984;&#8679;S"
    >
      <StrikethroughIcon className="h-4 w-4" />
    </ToolbarButton>
  )
}
