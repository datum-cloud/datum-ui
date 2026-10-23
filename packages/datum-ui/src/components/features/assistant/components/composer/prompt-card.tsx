'use client'

import type { Editor } from '@tiptap/react'
import type { ConversationDensity, EffortId } from '../../types'
import { EditorContent } from '@tiptap/react'
import { ArrowUp, Mic, MicOff, RotateCw, Send, Square } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '../../../../../utils/cn'
import { Tooltip } from '../../../../base/tooltip'
import { Icon } from '../../../../icons/icon-wrapper'
import { useAssistantConfig } from '../../context'
import { Equalizer } from './equalizer'
import { ModelSelector } from './model-selector'

interface PromptCardProps {
  editor: Editor | null
  isReady: boolean
  canRetry: boolean
  onSend: () => void
  onStop: () => void
  onRetry: () => void
  modelId: string
  effortId: EffortId
  onModelChange: (id: string) => void
  onEffortChange: (id: EffortId) => void
  speechSupported?: boolean
  isListening?: boolean
  frequencyData?: number[]
  onMicToggle?: () => void
  /**
   * `compact` is one row: the input and its buttons side by side in a plain
   * bordered field, with an outline send button. For a chat embedded in a page.
   */
  density?: ConversationDensity
  className?: string
}

export function PromptCard({
  editor,
  isReady,
  canRetry,
  onSend,
  onStop,
  onRetry,
  modelId,
  effortId,
  onModelChange,
  onEffortChange,
  speechSupported,
  isListening,
  frequencyData,
  onMicToggle,
  density = 'default',
  className,
}: PromptCardProps) {
  const { modelSelector } = useAssistantConfig()
  const compact = density === 'compact'
  const sendClasses = compact
    ? 'text-muted-foreground hover:text-foreground hover:bg-accent shrink-0 rounded-full p-1.5 transition-colors'
    : 'bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 rounded-full p-1.5 transition-colors'

  return (
    <div
      className={cn(
        compact
          ? 'bg-card border-input flex items-end gap-2 rounded-lg border py-1 pr-1.5 pl-3'
          : 'bg-card border-primary/30 rounded-2xl border p-3 shadow-sm transition-shadow',
        className,
      )}
    >
      <EditorContent
        editor={editor}
        className={cn(
          'max-h-52 overflow-y-auto',
          // The editor brings its own vertical padding; compact trims it so
          // the field is one 40px row.
          compact ? 'min-w-0 flex-1 [&_.ProseMirror]:py-0.5' : 'min-h-9 px-1 py-1',
        )}
      />

      <div className={cn('flex items-center justify-end gap-2', compact ? 'pb-0.5' : 'mt-1')}>
        <div className="flex items-center gap-1">
          {modelSelector && (
            <ModelSelector
              modelId={modelId}
              effortId={effortId}
              onModelChange={onModelChange}
              onEffortChange={onEffortChange}
            />
          )}

          {speechSupported && (
            <Tooltip message={isListening ? 'Stop dictating' : 'Dictate'} side="top">
              <button
                type="button"
                onClick={onMicToggle}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                className={cn(
                  'hover:bg-accent shrink-0 rounded-full p-1.5 transition-colors',
                  isListening
                    ? 'text-destructive hover:text-destructive/80'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {isListening
                  ? (
                      frequencyData
                        ? (
                            <Equalizer frequencyData={frequencyData} />
                          )
                        : (
                            <Icon icon={MicOff} className="size-4" />
                          )
                    )
                  : (
                      <Icon icon={Mic} className="size-4" />
                    )}
              </button>
            </Tooltip>
          )}

          <AnimatePresence>
            {canRetry && (
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Tooltip message="Retry last message" side="top">
                  <button
                    type="button"
                    onClick={onRetry}
                    aria-label="Retry last message"
                    className="text-muted-foreground hover:text-foreground hover:bg-accent shrink-0 rounded-full p-1.5 transition-colors"
                  >
                    <Icon icon={RotateCw} className="size-4" />
                  </button>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>

          {isReady
            ? (
                <Tooltip message="Send message" side="top">
                  <button
                    type="button"
                    onClick={onSend}
                    aria-label="Send message"
                    className={sendClasses}
                  >
                    <Icon icon={compact ? Send : ArrowUp} className="size-4" />
                  </button>
                </Tooltip>
              )
            : (
                <Tooltip message="Stop generating" side="top">
                  <button
                    type="button"
                    onClick={onStop}
                    aria-label="Stop generating"
                    className={sendClasses}
                  >
                    <Icon icon={Square} className="size-4 fill-current" />
                  </button>
                </Tooltip>
              )}
        </div>
      </div>
    </div>
  )
}
